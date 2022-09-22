#!/usr/bin/python
import subprocess
import time

def current_workspace():
    active = subprocess.run("hyprctl activewindow".split(), stdout=subprocess.PIPE).stdout.decode("utf-8").strip()
    return int(active.split(":")[4].split()[0].strip())


def gen_map(e):
    current = current_workspace()
    print(f"{current=}")
    if e < current:
        return [i for i in range(e+1, current, -1)]
    elif e > current:
        return [i for i in range(current,e+1)]
    else:
        return [current]

def go_to(e):
    print(f"change to {e}")
    _map = gen_map(e)
    print(f"{_map=}")
    t = 0.03*len(_map)
    for i in _map:
        subprocess.run(f"hyprctl dispatch workspace {i}".split())
        time.sleep(t)
        if t != 0.01:
            t -= 0.03
        else:
            t -= 0.02


go_to(10)
