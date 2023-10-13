#/usr/bin/env python

import pywal
import argparse
import os
import subprocess

THEME_DIR = os.environ.get("HYPRLAND_THEME")
print(THEME_DIR)

def apply(wallpaper):
    colors = pywal.colors.get(wallpaper,backend="colorz")
    print(wallpaper)
    
    cmd = f"swww img '{wallpaper}' --transition-type simple --transition-step 15"
    subprocess.run(cmd,shell=True)
    
    with open(os.path.expanduser("~/.config/hypr/themes/colors"),"w") as f:
        for color,value in colors["colors"].items():
            f.write(f"{color[5:]}: {value}\n")
        for color,value in colors["special"].items():
            f.write(f"{color}: {value}\n")

    subprocess.run("touch ~/.config/hypr/themes/colors",shell=True)
    subprocess.run("pkill -USR2 fish",shell=True)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("i", help="wallpaper index")
    # parser.add_argument("cycle", help="cycle wall", required=False)
    args = parser.parse_args()

    if args.i.isdigit():
        index = int(args.i)
        wallpaper = os.listdir(os.path.join(THEME_DIR, "wallpapers"))[index-1]
        wallpaper = os.path.join(os.path.join(THEME_DIR, "wallpapers"),wallpaper)
    else:
        wallpaper = os.path.expanduser(args.i)

    apply(wallpaper)

    

if __name__ == "__main__":
    main()