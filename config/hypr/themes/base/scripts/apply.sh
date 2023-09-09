#!/usr/bin/env fish

set -Ux STARSHIP_CONFIG $argv[1]/starship.toml
set color ~/.config/hypr/scripts/color

hyprctl keyword general:col.active_border "0xff$($color cursor -n)"
hyprctl keyword general:col.inactive_border "0xff$($color 8 -n)"

#TODO: add a check for asusctl
asusctl led-mode static -c "$($color cursor -n)"