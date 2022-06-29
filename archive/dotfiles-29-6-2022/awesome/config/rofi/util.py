import os

for file in os.listdir("./bin"):
    with open(f"./bin/{file}", "r") as f:
        conf = f.read()
    conf = conf.replace(
        "$HOME/.config/rofi", "$HOME/.config/awesome/config/rofi"
    )
    print("changing  ", file)
    with open(f"./bin/{file}", "w") as f:
        f.write(conf)
