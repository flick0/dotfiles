from PIL import Image, ImageFilter, ImageOps
import argparse
import subprocess
import os
import pywal
import json
import numpy as np
import cv2

def remove_black_border(image):
    # remove black border safely while conserving img
    return image

def get_res():
    cmd = "hyprctl monitors -j"
    res = subprocess.run(cmd,shell=True,capture_output=True)
    res = json.loads(res.stdout)

    return (res[0]["width"],res[0]["height"])

def apply(pre=None,wallpaper=None):
    if not pre:
        colors = pywal.colors.get(wallpaper,backend="colorz")
    else:
        colors = pre
    print(wallpaper)
    print("colors::::: ",colors)
    
    cmd = f"swww img '{wallpaper}' --transition-type simple --transition-step 15"
    subprocess.run(cmd,shell=True)
    
    with open(os.path.expanduser("~/.config/hypr/themes/colors"),"w") as f:
        for color,value in colors["colors"].items():
            f.write(f"{color[5:]}: {value}\n")
        for color,value in colors["special"].items():
            f.write(f"{color}: {value}\n")

    subprocess.run("touch ~/.config/hypr/themes/colors",shell=True)
    subprocess.run("pkill -USR2 fish",shell=True)

    # active borders
    gradient = ""
    for color,value in colors["colors"].items():
        gradient += f"rgba({value[1:]}ff) "
    gradient += " 45deg"
    cmd = f"hyprctl keyword general:col.active_border '{gradient}'"
    print(cmd)
    subprocess.run(cmd,shell=True)

    # inactive borders
    gradient = ""
    for color,value in colors["colors"].items():
        gradient += f"rgba({value[1:]}44) "
    gradient += " 0deg"
    cmd = f"hyprctl keyword general:col.inactive_border '{gradient}'"
    print(cmd)
    subprocess.run(cmd,shell=True)

    #keyboard
    cmd = f"asusctl led-mode static -c '{colors['colors']['color0'][1:]}'"
    print(cmd)
    subprocess.run(cmd,shell=True)

    #cava
    with open(os.path.expanduser("~/.config/cava/config"),"r") as f:
        conf = f.read()
    
    conf = conf.split("#--- cover2bg.py ---")[0]

    conf += "\n#--- cover2bg.py ---\n" + f"""
[color]
background = '{colors["special"]["background"]}'

gradient = 1

gradient_color_1 = '{colors["colors"]["color0"]}'
gradient_color_2 = '{colors["colors"]["color1"]}'
gradient_color_3 = '{colors["colors"]["color2"]}'
gradient_color_4 = '{colors["colors"]["color3"]}'
gradient_color_5 = '{colors["colors"]["color4"]}'
gradient_color_6 = '{colors["colors"]["color5"]}'
gradient_color_7 = '{colors["colors"]["color6"]}'
gradient_color_8 = '{colors["colors"]["color7"]}'
"""
    with open(os.path.expanduser("~/.config/cava/config"),"w") as f:
        f.write(conf)
    
    subprocess.run("pkill -USR2 cava",shell=True)







def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image", help="image path")

    width,height = get_res()

    args = parser.parse_args()

    image = args.image

    #subprocess.run(f"magick mogrify -fuzz 20% -trim +repage -shave 7x7 -format png {image}",shell=True)

    # open image
    pre = pywal.colors.get(image,backend="colorz")

    image = Image.open(image)
    
    #image = ImageOps.fit(image, (width,height), Image.NEAREST)
    #image.show()
    
    image = image.filter(ImageFilter.GaussianBlur(radius=5))
    image.save("/tmp/bg.png")

    apply(wallpaper="/tmp/bg.png")
    

if __name__ == "__main__":
    main()