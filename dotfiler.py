#!/usr/bin/python
import datetime
import subprocess
from pathlib import Path

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
destination = "./archive/dotfiles-{}-{}-{}/".format(
    datetime.datetime.now().day,
    datetime.datetime.now().month,
    datetime.datetime.now().year,
)

subprocess.run(["mkdir", destination])
Path(destination + "readme.md").touch()

log = ""
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
        print("Copied {}".format(file))
        log += "✅ {}\n".format(str(file).replace(str(Path.home()), "[HOME]"))

with open(destination + "readme.md", "w") as f:
    f.write(
        f"""
# Dotfiles Backup
 created at {datetime.datetime.now()}.

```ocaml
{log}
```
"""
    )
