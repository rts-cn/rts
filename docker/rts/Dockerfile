FROM xswitch.tencentcloudcr.com/xswitch/xswitch:bookworm as xswitch-build-bookworm
LABEL maintainer="Seven Du <dujinfang@x-y-t.cn>"
SHELL ["/bin/bash", "-c"]

COPY . .

RUN ls ./ && cp ./docker/rts/modules.conf ./
ENV PKG_CONFIG_PATH=/usr/local/mrcp/lib/pkgconfig:/usr/local/freeswitch/lib/pkgconfig

RUN ./bootstrap.sh && \
  ./configure --enable-core-odbc-support && \
  make -j $(nproc --all) && \
  make install

## release-base for bookworm
FROM debian:bookworm-20230814-slim as bookworm-base
LABEL maintainer="Seven Du <dujinfang@x-y-t.cn>"

SHELL ["/bin/bash", "-c"]

RUN --mount=type=cache,target=/var/cache/apt,id=apt_cache,sharing=locked \
  rm -rf /var/cache/apt/archives/lock && \
  sed -i 's/Components: main/Components: main contrib non-free non-free-firmware/g' /etc/apt/sources.list.d/debian.sources && \
  apt-get update && apt-get install -y \
  --no-install-recommends --no-install-suggests --fix-missing \
  uuid zlib1g 'libjpeg8|libjpeg62-turbo' libpcap0.8 \
  libncurses5 libssl-dev libpcre3 libcurl4 \
  libedit2 libspeexdsp1 libatomic1 \
  libsqlite3-0 libgdbm6 libdb5.3 libvlc5 \
  libsndfile1 libopus0 liblua5.2-0 libtiff5-dev libswresample4 libfreetype6 \
  libpng16-16 yasm nasm libavformat59 libswscale6 libavfilter8 \
  libshout3 libmpg123-0 libmp3lame0 sntp \
  libmagickcore-6.q16-6 libjemalloc2 make \
  libhiredis0.14 unixodbc libpq5 librabbitmq4 librdkafka1 rrdtool \
  libmariadb3 libprotobuf-dev libprotobuf-c1 libopenal1 \
  libopencore-amrwb0 libvo-amrwbenc0 lua-rrd libpython3-dev \
  nano vim tcpdump net-tools ca-certificates curl wget gnupg \
  iputils-ping htop procps sngrep espeak-ng lua5.2 libgd-dev \
  && if [[ $(dpkg --print-architecture) == 'amd64' ]];then \
  apt-get install -y --no-install-recommends --no-install-suggests fdkaac odbc-mariadb ;fi \
  && rm -rf /var/lib/apt/lists/*

RUN echo "kernel.core_pattern = /usr/local/freeswitch/log/core.%e.%p.%t" >> /etc/sysctl.conf
ENV PKG_CONFIG_PATH=/usr/local/mrcp/lib/pkgconfig:/usr/local/freeswitch/lib/pkgconfig

# copy lib freeswitch from xswitch-build image
COPY --from=xswitch-build-bookworm /usr/local/lib /usr/local/lib
COPY --from=xswitch-build-bookworm /usr/local/freeswitch /usr/local/freeswitch

RUN ln -sf /usr/local/freeswitch/bin/freeswitch /usr/bin/ && \
    ln -sf /usr/local/freeswitch/bin/fs_cli /usr/bin/
COPY ./docker/rts/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod a+x /docker-entrypoint.sh
CMD ["/docker-entrypoint.sh"]
