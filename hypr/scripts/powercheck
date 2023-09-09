#!/usr/bin/env bash
POWER=$(cat /sys/class/power_supply/ADP0/online)

case $POWER in
    0)
        /usr/bin/profile-battery.sh;;
    
    1)
        /usr/bin/profile-power.sh;;
esac