#!/bin/sh
# uso: sh src/shot.sh pagina.html ancho alto salida.png [scrollY]
OUT="C:/Users/USER-0~1/AppData/Local/Temp/claude/C--Users-USER---001-Desktop-We-Rock-We-Rock/d709a401-ccc9-4db7-bbe0-44b6000c4114/scratchpad/$4"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=8000 --window-size=$2,$3 --screenshot="$OUT" "http://localhost:8765/$1?shot&y=${5:-0}" 2>/dev/null
