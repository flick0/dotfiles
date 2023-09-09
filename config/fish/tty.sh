#!/usr/bin/env bash

if [ "$TERM" = "linux" ]; then
	printf %b '\e]P01E1E2E' # set background color to "Base"
	printf %b '\e]P8585B70' # set bright black to "Surface2"

	printf %b '\e]P7BAC2DE' # set text color to "Text"
	printf %b '\e]PFA6ADC8' # set bright white to "Subtext0"

	printf %b '\e]P1F38BA8' # set red to "Red"
	printf %b '\e]P9F38BA8' # set bright red to "Red"

	printf %b '\e]P2A6E3A1' # set green to "Green"
	printf %b '\e]PAA6E3A1' # set bright green to "Green"

	printf %b '\e]P3F9E2AF' # set yellow to "Yellow"
	printf %b '\e]PBF9E2AF' # set bright yellow to "Yellow"

	printf %b '\e]P489B4FA' # set blue to "Blue"
	printf %b '\e]PC89B4FA' # set bright blue to "Blue"

	printf %b '\e]P5F5C2E7' # set magenta to "Pink"
	printf %b '\e]PDF5C2E7' # set bright magenta to "Pink"

	printf %b '\e]P694E2D5' # set cyan to "Teal"
	printf %b '\e]PE94E2D5' # set bright cyan to "Teal"

	clear
fi
