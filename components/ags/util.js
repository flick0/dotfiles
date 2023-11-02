import { App, Utils } from "./imports.js";

function arrremove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

function arradd(arr, value) {
  if (arr.includes(value)) {
    return arr;
  }
  arr.push(value);
  return arr;
}

const home = `/home/${Utils.exec("whoami")}`;
const themedir = App.configDir.split("/").slice(0, -2).join("/");

const scss = App.configDir + "/style/style.scss";
const css = App.configDir + "/style/style.css";
const { execAsync } = Utils;

const { exec } = Utils;
const SCREEN_WIDTH = Number(
  exec(
    `bash -c "xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f1 | head -1"`
  )
);
const SCREEN_HEIGHT = Number(
  exec(
    `bash -c "xrandr --current | grep '*' | uniq | awk '{print $1}' | cut -d 'x' -f2 | head -1"`
  )
);
globalThis["SCREEN_WIDTH"] = SCREEN_WIDTH;
globalThis["SCREEN_HEIGHT"] = SCREEN_HEIGHT;

export {
  arradd,
  arrremove,
  home,
  themedir,
  scss,
  css,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
};
