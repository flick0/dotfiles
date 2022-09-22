<div align="justify">

<div align="center">

```ocaml
 ✨ hyprland / dreamy / catppuccin ✨
```


## gallery
![cava](./assets/cava.png)
![term](./assets/terminal.png)
[![workflow](https://img.youtube.com/vi/Ly7ANfUgGXQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=Ly7ANfUgGXQ)

</div>
</div>

## installation
<hr>

# Arch
dependancies
```
hyprland-git waybar-hyprland-git cava waybar-mpris-git python rustup kitty fish wofi xdg-desktop-portal-wlr tty-clock-git swaylockd grim slurp
```
using `paru`
```
paru -S hyprland-git waybar-hyprland-git cava waybar-mpris-git python rustup kitty fish wofi xdg-desktop-portal-wlr tty-clock-git swaylockd grim slurp
```

# building scirpts used in this rice

`swww` | wallpaper changer/daemon
```bash
cd ./config/hypr/components/source/swww
cargo build --release
```

`rgb-borders` | rgb borders for grouped windows
```bash
cd ./config/hypr/components/source/rgb-rs
cargo build --release
cp ./target/release/rgb-borders ../../../scripts
```

# moving config files

```bash
cp -r ./config/* ~/.config
```



