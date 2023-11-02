#!/usr/bin/env fish

echo $argv[1]
set -Ux STARSHIP_CONFIG $argv[1]/starship.toml
set -Ux HYPRLAND_THEME $argv[1]
set color ~/.config/hypr/scripts/color

pkill foot 
foot -s -c $argv[1]/components/foot.ini &

pkill dunst &
pkill -USR2 fish &

swww init &
sleep 0.5
swww clear c2bda6 &

#TODO: add a check for asusctl
asusctl led-mode static -c "c2bda6" &

ags -c ~/rice/themes/nier/components/ags/config.js &


