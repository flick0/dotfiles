#!/usr/bin/env fish

set -Ux STARSHIP_CONFIG $argv[1]/starship.toml
set -Ux HYPRLAND_THEME $argv[1]
set color ~/.config/hypr/scripts/color

pkill dunst &
pkill -USR2 fish &

swww init &

#TODO: add a check for asusctl
asusctl led-mode static -c "$($color cursor -n)" &

python $argv[1]/scripts/pywal_set.py 1 &

ags -c ~/rice/themes/aurora/components/ags/config.js &


