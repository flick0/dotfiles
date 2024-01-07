##############################################################################################################
# thanks to @cutieqt1 from discord for sending me this
##############################################################################################################

echo "Installing Rice...."
sleep 1
echo "initzializing install script...."
sleep 1
echo "done..."
sleep 1

echo "master branch time"
sleep 1
echo "installing programs"
paru -S hyprland-git foot grim slurp swww-git fish light-git swaylock-effects-git swayidle theme.sh sddm
sleep 1
echo "Git Cloning from github...."
git clone https://github.com/flick0/dotfiles /tmp/flick0-dotfiles 
echo "copying..."
sleep 2
cd /tmp/flick0-dotfiles && cp -r ./config/* ~/.config/ && cd
sleep 1
echo "YorHa time!!!"
sleep 1
paru -S aylurs-gtk-shell-git sassc starship cava imagemagick hyprland-plugin-hyprbars-git
sleep 1
echo "Please Insert Password"
sudo curl -L https://raw.githubusercontent.com/flick0/sttt/main/sttt -o /usr/local/bin/sttt
sudo chmod a+rx /usr/local/bin/sttt
echo "git blah blah"
mkdir ~/.config/hypr/themes && git clone -b hyprland-yorha https://github.com/flick0/dotfiles ~/.config/hypr/themes/yorha

echo " - ### Apply theme
  
  - manual
     > change the `$THEME` variable in hyprland conf to `./themes/yorha`
  
  - hyprtheme
     > soon "
