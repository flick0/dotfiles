#!/usr/bin/python
from pathlib import Path
import datetime
import subprocess

CONFIG = Path(Path.home(), ".config")
to_backup = [
    Path(CONFIG, "awesome"),
    Path(CONFIG, "kitty"),
    Path(CONFIG, "cava"),
    Path(CONFIG, "picom.conf"),
    Path(CONFIG, "fish"),
    Path(CONFIG, "sxhkd"),
    Path(CONFIG, "tint2"),
    Path(CONFIG, "spicetify"),
    Path(CONFIG, "nautilus"),
]
destination = "./dotfiles/dotfiles-{}-{}-{}/".format(
    datetime.datetime.now().day,
    datetime.datetime.now().month,
    datetime.datetime.now().year,
)

subprocess.run(["mkdir", destination])
Path(destination + "readme.md").touch()

for file in to_backup:
    if file.exists():
        subprocess.run(
            [
                "cp",
                "-r",
                str(file),
                destination,
            ]
        )
