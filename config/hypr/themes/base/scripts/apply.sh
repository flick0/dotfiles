#!/usr/bin/env fish

set -Ux STARSHIP_CONFIG $argv[1]/starship.toml
set color ~/.config/hypr/scripts/color

pkill -USR2 fish

hyprctl keyword general:col.active_border "0xff$($color cursor -n)"
hyprctl keyword general:col.inactive_border "0xff$($color 8 -n)"

#TODO: add a check for asusctl
asusctl led-mode static -c "$($color cursor -n)"

sed -e "s/{{0}}/$($color 0)/g" \
    -e "s/{{1}}/$($color 1)/g" \
    -e "s/{{2}}/$($color 2)/g" \
    -e "s/{{3}}/$($color 3)/g" \
    -e "s/{{4}}/$($color 4)/g" \
    -e "s/{{5}}/$($color 5)/g" \
    -e "s/{{6}}/$($color 6)/g" \
    -e "s/{{7}}/$($color 7)/g" \
    -e "s/{{8}}/$($color 8)/g" \
    -e "s/{{9}}/$($color 9)/g" \
    -e "s/{{10}}/$($color 10)/g" \
    -e "s/{{11}}/$($color 11)/g" \
    -e "s/{{12}}/$($color 12)/g" \
    -e "s/{{13}}/$($color 13)/g" \
    -e "s/{{14}}/$($color 14)/g" \
    -e "s/{{15}}/$($color 15)/g" \
    -e "s/{{foreground}}/$($color foreground)/g" \
    -e "s/{{background}}/$($color background)/g" \
    -e "s/{{cursor}}/$($color cursor)/g" \
    $argv[1]/components/ironbar/template.sass > $argv[1]/components/ironbar/style.sass

#bar
pkill ironbar
IRONBAR_CONFIG=$argv[1]/components/ironbar/ironbar.json IRONBAR_CSS=$argv[1]/components/ironbar/style.sass ironbar