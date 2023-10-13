from PIL import Image, ImageFilter, ImageOps
import argparse
import subprocess
import os
import pywal

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

    gradient = ""
    for color,value in colors["colors"].items():
        gradient += f"rgba({value[1:]}ff) "
    gradient += " 45deg"
    cmd = f"hyprctl keyword general:col.active_border '{gradient}'"
    print(cmd)
    subprocess.run(cmd,shell=True)

    gradient = ""
    for color,value in colors["colors"].items():
        gradient += f"rgba({value[1:]}44) "
    gradient += " 0deg"
    cmd = f"hyprctl keyword general:col.inactive_border '{gradient}'"
    print(cmd)
    subprocess.run(cmd,shell=True)



def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("image", help="image path")

    args = parser.parse_args()

    image = args.image

    # open image
    image = Image.open(image)

    image = image.filter(ImageFilter.GaussianBlur(radius=5))

    #image.show()

    # save image
    image.save("/tmp/bg.png")

    apply("/tmp/bg.png")
    

if __name__ == "__main__":
    main()