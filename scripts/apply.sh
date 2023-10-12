#!/usr/bin/env fish

set -Ux STARSHIP_CONFIG $argv[1]/starship.toml
set color ~/.config/hypr/scripts/color

pkill -USR2 fish &

#TODO: add a check for asusctl
asusctl led-mode static -c "$($color cursor -n)" &

swww init &

ags -c ~/rice/themes/aurora/components/ags/config.js &