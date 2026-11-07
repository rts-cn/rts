#!/usr/bin/env bash
#
# sync-upstream.sh — 把上游 master 的新提交追加到「修过 author 行」的镜像分支
#
# 背景
#   上游 signalwire/freeswitch 有两个 2014 年的提交各带两条 author 行，
#   `git fsck` 报 multipleAuthors：
#       8574988c3a  Completely unbundle libedit
#       487128950d  Use the system version of APR / APR-util if possible
#   镜像分支（默认 master-fixed-2-authors）是把这两个提交改写成合法单 author
#   之后的整段历史：每个提交的 tree 与上游逐一相同，只有 hash 不同，
#   分叉点因此停在 1cde5f01e0 (2014-03-23, = 8574988c3a 的 parent)。
#
#   所以「把上游的修改同步到这个分支」= 把 上次同步点..上游tip 这段提交
#   replay 到镜像分支后面。因为内容逐字节相同、只改了 metadata：
#     * 不会产生冲突
#     * 镜像分支只往后长 → push 是 fast-forward，不需要 --force
#     * 上游的 merge 提交会被 flatten（与镜像原有形态一致）
#     * 脚本最后用 git diff 校验内容与上游 tip 完全一致，防止 flatten 丢改动
#
# 用法
#   ./sync-upstream.sh                  # 同步到上游最新
#   ./sync-upstream.sh -n               # dry-run：只报告要搬多少提交
#   ./sync-upstream.sh -p               # 同步后自动 push 镜像分支
#   ./sync-upstream.sh -m <branch>      # 镜像分支（默认 master-fixed-2-authors）
#   ./sync-upstream.sh -r <remote>      # 上游 remote（默认 origin）
#   ./sync-upstream.sh -u <branch>      # 上游分支（默认 master）
#   ./sync-upstream.sh -t <tag>         # 记录同步点的 tag（默认 synced/upstream）
#   ./sync-upstream.sh -P <remote>      # push 到哪个 remote（默认 rts）
#   ./sync-upstream.sh --no-keep-committer-date  # committer date 用「同步的当前时间」
#   ./sync-upstream.sh --no-fetch       # 不 fetch，直接用现有远端引用
#
# 默认 committer date = author date（避免所有 replay 出来的提交都显示成同步当天）；
# 若想保留“同步时间”作为 committer date，加 --no-keep-committer-date。
#   ./sync-upstream.sh --init <sha>     # 首次：手工指定同步点（上游提交）
#
# 只在镜像分支上做「追加」，不重写已有历史，所以任何时候都可以安全中断。

set -euo pipefail

MIRROR=master-fixed-2-authors
REMOTE=origin
UPSTREAM=master
SYNC_TAG=synced/upstream
PUSH_REMOTE=rts
DRY_RUN=0
DO_FETCH=1
DO_PUSH=0
KEEP_COMMITTER_DATE=1
INIT_SHA=

# 本地对象库里那两个坏提交（重写后已不可达，fsck 仍会扫到，属正常残留）
KNOWN_BAD_1=487128950df6ee433c131b5feaafe81ee86629f4
KNOWN_BAD_2=8574988c3a378b4d5861ecaeb0e958657635703b

info() { printf '\033[36m::\033[0m %s\n' "$*"; }
warn() { printf '\033[33m!!\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[31mERROR\033[0m %s\n' "$*" >&2; exit 1; }

usage() {
  awk 'NR>1 && /^#/ {sub(/^# ?/, ""); print; next} NR>1 && !/^#/ {exit}' "$0"
  exit 0
}

# ---- 参数 ----
while [ $# -gt 0 ]; do
  case "$1" in
    -m) MIRROR=$2; shift 2 ;;
    -r) REMOTE=$2; shift 2 ;;
    -u) UPSTREAM=$2; shift 2 ;;
    -t) SYNC_TAG=$2; shift 2 ;;
    -P) PUSH_REMOTE=$2; shift 2 ;;
    -n|--dry-run) DRY_RUN=1; shift ;;
    -p|--push)    DO_PUSH=1; shift ;;
    -h|--help)    usage ;;
    --no-fetch)   DO_FETCH=0; shift ;;
    --keep-committer-date)    KEEP_COMMITTER_DATE=1; shift ;;
    --no-keep-committer-date) KEEP_COMMITTER_DATE=0; shift ;;
    --init)       INIT_SHA=$2; shift 2 ;;
    --init=*)     INIT_SHA=${1#*=}; shift ;;
    *) die "未知参数: $1（-h 查看用法）" ;;
  esac
done

# ---- 前置检查 ----
git rev-parse --git-dir >/dev/null 2>&1 || die "当前目录不是 git 仓库"

# 未跟踪文件没关系，但有改动的已跟踪文件会挡住 rebase
git diff-index --quiet HEAD -- || die "工作区有未提交的修改，请先 commit / stash"

[ -n "$INIT_SHA" ] || git rev-parse -q --verify "refs/heads/$MIRROR" >/dev/null \
  || die "本地没有镜像分支 $MIRROR（可用 -m 指定，或先 git branch $MIRROR rts/$MIRROR）"

ORIG_BRANCH=$(git symbolic-ref -q --short HEAD || true)

# ---- fetch ----
if [ "$DO_FETCH" = 1 ]; then
  info "fetch $REMOTE/$UPSTREAM"
  git fetch --prune "$REMOTE" "+refs/heads/$UPSTREAM:refs/remotes/$REMOTE/$UPSTREAM"
fi

UP=$(git rev-parse --verify --quiet "$REMOTE/$UPSTREAM^{commit}") \
  || die "找不到 $REMOTE/$UPSTREAM（试试 --no-fetch 或检查 remote 名）"

# ---- 同步点（tag）----
if [ -n "$INIT_SHA" ]; then
  git tag -f "$SYNC_TAG" "$INIT_SHA" >/dev/null
  info "同步点初始化: $SYNC_TAG -> $(git rev-parse --short "$INIT_SHA")"
elif git rev-parse -q --verify "refs/tags/$SYNC_TAG" >/dev/null; then
  :
else
  # 没有 tag 时，用「镜像 tip 的 tree == 上游某提交的 tree」自动推断同步点
  MT=$(git rev-parse "$MIRROR^{tree}")
  FOUND=$(git log --format='%T %H' "$UP" | awk -v t="$MT" '$1==t {print $2; exit}')
  [ -n "$FOUND" ] || die "无法推断同步点：$MIRROR 的 tree 在上游历史里没有对应提交。用 --init <上游sha> 指定"
  git tag -f "$SYNC_TAG" "$FOUND" >/dev/null
  warn "自动推断同步点: $SYNC_TAG -> $(git rev-parse --short "$FOUND")"
fi

SYNCED=$(git rev-parse "$SYNC_TAG^{commit}")

if [ "$SYNCED" = "$UP" ]; then
  info "已是最新：$SYNC_TAG = $REMOTE/$UPSTREAM = $(git rev-parse --short "$UP")"
  exit 0
fi

TOTAL=$(git rev-list --count "$SYNCED..$UP")
PICKS=$(git rev-list --no-merges --count "$SYNCED..$UP")
info "待搬运 $TOTAL 个上游提交（merge $((TOTAL - PICKS)) 个会被 flatten，实际 replay $PICKS 个）"
git --no-pager log --oneline --no-merges -n 5 "$SYNCED..$UP" | sed 's/^/   /'
[ "$PICKS" -gt 5 ] && echo "   ... 共 $PICKS 个"

if [ "$DRY_RUN" = 1 ]; then
  info "dry-run：未做任何修改"
  exit 0
fi

# ---- replay ----
OLD_MIRROR=$(git rev-parse "$MIRROR")
info "replay 到 $MIRROR ($(git rev-parse --short "$OLD_MIRROR"))"
REBASE_ARGS=(--onto "$MIRROR" "$SYNCED")
[ "$KEEP_COMMITTER_DATE" = 1 ] && REBASE_ARGS+=(--committer-date-is-author-date)

git switch --detach "$UP" >/dev/null
if ! git rebase "${REBASE_ARGS[@]}"; then
  warn "rebase 出现冲突。内容本该完全一致，说明这次上游有需要人工判断的情况。"
  echo "  · 解决冲突后: git rebase --continue"
  echo "  · 放弃本次同步: git rebase --abort"
  echo "  镜像分支 $MIRROR 未被修改。"
  exit 1
fi

# ---- 校验：内容必须与上游 tip 完全一致 ----
if ! git diff --quiet HEAD "$UP"; then
  TMP_BRANCH="mirror-mismatch-$(date +%Y%m%d-%H%M%S)"
  git switch -C "$TMP_BRANCH" >/dev/null
  warn "内容与上游 tip 不一致：flatten 可能丢掉了 merge 中的改动。"
  echo "  replay 结果已存到分支 $TMP_BRANCH，差异摘要："
  git --no-pager diff --stat HEAD "$UP" | tail -10 | sed 's/^/   /'
  echo "  镜像分支 $MIRROR 未被修改。"
  exit 1
fi
info "内容校验通过（tree 与 $REMOTE/$UPSTREAM 完全一致）"

# ---- 更新镜像分支 + 同步点 ----
git switch -C "$MIRROR" >/dev/null
git tag -f "$SYNC_TAG" "$UP" >/dev/null

# ---- fsck（忽略本地残留的两个坏对象）----
fsck_bad=$(git fsck --no-progress HEAD 2>&1 \
  | grep -v -e '^Checking' -e 'dangling' -e "^error in commit $KNOWN_BAD_1" -e "^error in commit $KNOWN_BAD_2" \
  | grep -v '^$' || true)
if [ -n "$fsck_bad" ]; then
  warn "fsck 有其它问题（请检查是否上游又出现了坏提交）："
  echo "$fsck_bad" | sed 's/^/   /' >&2
else
  info "fsck 干净（忽略本地残留的 2 个旧坏对象）"
fi

# ---- push ----
if [ "$DO_PUSH" = 1 ]; then
  info "push $MIRROR -> $PUSH_REMOTE"
  git push "$PUSH_REMOTE" "$MIRROR"
fi

# ---- 回到原来的分支 ----
if [ -n "$ORIG_BRANCH" ] && [ "$ORIG_BRANCH" != "$MIRROR" ]; then
  git switch "$ORIG_BRANCH" >/dev/null 2>&1 || true
fi

# ---- 总结 ----
echo
info "完成：$MIRROR = $(git rev-parse --short "$MIRROR")，上游 = $(git rev-parse --short "$UP")"
echo "  下一个同步点已记录在 tag $SYNC_TAG"
[ "$DO_PUSH" = 0 ] && echo "  推送（fast-forward，无需 --force）:  git push $PUSH_REMOTE $MIRROR"
echo
echo "  把开发分支搬到新镜像上（只搬你自己的提交）："
echo "    git switch <你的分支>"
echo "    git rebase --onto $MIRROR $(git rev-parse --short "$OLD_MIRROR") <你的分支>"
