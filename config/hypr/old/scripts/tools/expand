#!/usr/bin/bash
TEMP=/tmp/current_wall

files=(~/.config/hypr/wallpapers/*)

hypr=~/.config/hypr
scripts=$hypr/scripts

cooldown=0.1


while true
do
    case "$1" in
        "cycle")
            index=$(cat $TEMP)
            index=$((index+1))
            if [ $index -ge ${#files[@]} ]; then
                index=0
            fi
            echo $index > $TEMP
            $scripts/wall "${files[$index]}"
            exit 0
            ;;
        "arrow-icon")
            if $scripts/toolbar_state; then
                echo ""
            else
                echo ""
            fi
            ;;
        "ss-icon")
            if $scripts/toolbar_state; then
                echo ""
            else
                echo ""
            fi
            ;;
        # "media")
            
        *)
            if $scripts/toolbar_state; then
                echo "     "
            else
                echo ""
            fi
            ;;
    esac
    sleep $cooldown
done