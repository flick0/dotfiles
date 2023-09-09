#!/usr/bin/env bash

color=~/.config/hypr/scripts/color

hyprctl keyword general:col.active_border "0xff$($color cursor -n)"
hyprctl keyword general:col.inactive_border "0xff$($color 8 -n)"
asusctl led-mode static -c "$($color cursor -n)"