# Xswitch 官网

[Xswitch 官网项目](https://xswitch.cn/)

## 运行项目

```
make setup
make dev
```

打开浏览器在 `localhost:3000` 预览

## 编译生产环境代码

```
make setup (执行过一次可跳过)
make release
```

生产代码环境在 `./out` 文件夹

## 本地预览生产环境界面

```
make setup (执行过一次可跳过)
make release
cd ./out
python3 -m http.server 9000
```

打开浏览器在 `localhost:9000` 预览

## 开发

本项目在此[模版](https://github.com/timlrx/tailwind-nextjs-starter-blog)基础上开发

## 发布

```
make install
```
