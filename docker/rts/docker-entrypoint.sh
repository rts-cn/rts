#!/bin/bash

ldconfig
systcl -p
LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2 /usr/local/freeswitch/bin/freeswitch -c -rp -nonat -elegant-term -reincarnate-reexec
