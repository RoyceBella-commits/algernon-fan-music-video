#!/bin/zsh
# Download the OFL fonts used by the MV (and their licenses) into story/public/fonts (not committed).
set -e
cd "$(dirname "$0")/../public" && mkdir -p fonts && cd fonts
G=https://raw.githubusercontent.com/google/fonts/main/ofl
get() { [[ -f $2 ]] || curl -sSfL -o "$2" "$1"; }
get $G/shipporiminchob1/ShipporiMinchoB1-SemiBold.ttf ShipporiMinchoB1-SemiBold.ttf
get $G/shipporiminchob1/ShipporiMinchoB1-Medium.ttf   ShipporiMinchoB1-Medium.ttf
get $G/shipporiminchob1/OFL.txt                       OFL-ShipporiMinchoB1.txt
get $G/kleeone/KleeOne-SemiBold.ttf                   KleeOne-SemiBold.ttf
get $G/kleeone/OFL.txt                                OFL-KleeOne.txt
get $G/zcoolkuaile/ZCOOLKuaiLe-Regular.ttf            ZCOOLKuaiLe-Regular.ttf
get $G/zcoolkuaile/OFL.txt                            OFL-ZCOOLKuaiLe.txt
get https://github.com/lxgw/LxgwWenKai/releases/latest/download/LXGWWenKai-Regular.ttf LXGWWenKai-Regular.ttf
get https://raw.githubusercontent.com/lxgw/LxgwWenKai/main/OFL.txt OFL-LXGWWenKai.txt
ls -1
