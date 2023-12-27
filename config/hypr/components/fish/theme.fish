function theme --on-signal USR2
    theme.sh < $HOME/.config/hypr/colors
end

if status is-interactive
	pokemon-colorscripts -r --no-title &
	starship init fish | source &
	theme
end