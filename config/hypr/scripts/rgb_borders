#!/usr/bin/python

import subprocess
import time
from colour import Color

gradient = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
]

def color_range(*args):
    l = []
    for i,color in enumerate(args):
        if i == len(args)-1:
            break
        l.extend(color.range_to(args[i+1], 25))
    return l

def rgb_to_hex(r,g,b):
    return '%02x%02x%02x' % (r,g,b)

def set_color(r,g,b):
    print(rgb_to_hex(r,g,b))
    subprocess.run(f"hyprctl keyword dwindle:col.group_border_active 0xff{rgb_to_hex(r,g,b)}".split())
    subprocess.run(f"hyprctl keyword dwindle:col.group_border 0x66{rgb_to_hex(r,g,b)}".split())

colors = color_range(*[Color(i) for i in gradient])

while 1:
    for col in colors:
        set_color(int(col.red*255), int(col.green*255), int(col.blue*255))
        time.sleep(0.05)
    for col in colors[::-1]:
        set_color(int(col.red*255), int(col.green*255), int(col.blue*255))
        time.sleep(0.05)