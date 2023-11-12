// importing
import {
  Hyprland,
  Notifications,
  Mpris,
  Audio,
  Battery,
  SystemTray,
  App,
  Widget,
  Utils,
  Variable,
} from "./imports.js";

import { NierButton, NierButtonGroup, NierLongButton } from "./nier/buttons.js";

import { arradd, arrremove, css, scss } from "./util.js";
import { Workspaces } from "./widgets/workspace.js";
import { Info } from "./widgets/info.js";
import { NierSliderButton } from "./nier/slider.js";
import { NierDropDownButton } from "./nier/dropdown.js";
import { NierSettingPane } from "./windows/settings.js";
import { NowPlaying } from "./widgets/nowplaying.js";
import { AppLauncher } from "./windows/applauncher.js";
// import { NierDropDownButton } from "./nier/dropdown.js";

const { exec, subprocess, execAsync } = Utils;
const { Box, Window, Label, Button, Revealer, Icon } = Widget;

exec(`sassc ${scss} ${css}`);

subprocess(
  [
    "inotifywait",
    "--recursive",
    "--event",
    "create,modify",
    "-m",
    App.configDir + "/style",
  ],
  () => {
    exec(`sassc ${scss} ${css}`);
    App.resetCss();
    App.applyCss(css);
  }
);

const top = () =>
  Box({
    vertical: true,
    className: ["top"],
    children: [
      Box({
        spacing: 20,
        halign: "fill",
        style: `min-width: ${SCREEN_WIDTH}px;`,
        children: [
          Workspaces({}),
          Button({
            halign: "end",
            hexpand: true,
            className: ["settings-button"],
            child: Icon({
              size: 40,
              icon: App.configDir + "/assets/yorha.png",
            }),
            onClicked: () => {
              App.toggleWindow("settings");
            },
            onHover: (button) => {
              let right = button.parent.children[2];
              button.className = arradd(button.className, "hover");
              right.className = arradd(right.className, "hover");
            },
            onHoverLost: (button) => {
              let right = button.parent.children[2];
              button.className = arrremove(button.className, "hover");
              right.className = arrremove(right.className, "hover");
            },
          }),
          Box({
            // vexpand: true,
            halign: "start",
            className: ["yorha-right"],
          }),
        ],
      }),
      Box({
        className: ["under-workspaces"],
        style: `background: url("${
          App.configDir + "/assets/nier-border.svg"
        }") repeat-x;min-width: ${SCREEN_WIDTH}px;background-size: 100px 25px;min-height: 100px;`,
      }),
      // NowPlaying({}),
    ],
  });

const Bar = ({ monitor } = {}) => {
  return Window({
    name: `bar`, // name has to be unique
    className: "bar",
    monitor,
    margin: [0, 0],
    anchor: ["top", "left", "right"],
    exclusive: false,
    layer: "top",
    child: Box({
      style: "margin-top: 10px;",
      children: [top()],
    }),
  });
};

const Side = () =>
  Window({
    name: "side",
    margin: [10, 10],
    anchor: ["right", "top", "bottom"],
    exclusive: false,
    layer: "bottom",
    child: Box({
      valign: "center",
      halign: "center",
      child: NowPlaying({}),
    }),
  });

// const LSide = () =>
//   Window({
//     name: "lside",
//     margin: [10, 10],
//     anchor: ["left", "top", "bottom"],
//     exclusive: false,
//     focusable: true,
//     layer: "bottom",
//     child: Box({
//       valign: "center",
//       halign: "center",
//       child: AppLauncher(),
//     }),
//   });

const BottomBar = () =>
  Window({
    name: "bottombar",
    margin: [0, 0],
    anchor: ["bottom", "left", "right"],
    exclusive: false,
    layer: "bottom",
    child: Box({
      className: ["under-workspaces"],
      style: `background: url("${
        App.configDir + "/assets/nier-border.svg"
      }") repeat-x;min-width: ${SCREEN_WIDTH}px;background-size: 100px 25px;min-height: 100px;`,
      child: Label(""),
    }),
  });

export default {
  closeWindowDelay: {
    settings: 500, // milliseconds
  },
  style: css,
  windows: [
    // BottomBar()
    Bar(),
    // LSide(),
    NierSettingPane(),
    Side(),
    BottomBar(),
    // you can call it, for each monitor
    // Bar({ monitor: 0 }),
    // Bar({ monitor: 1 })
  ],
};
