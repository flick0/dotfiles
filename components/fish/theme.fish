function theme --on-signal USR2
    theme.sh < $COLORFILE
end

if status is-interactive
	starship init fish | source &
	theme
    sttt
end