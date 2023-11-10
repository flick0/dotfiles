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

import { css, scss } from "./util.js";
import { Workspaces } from "./widgets/workspace.js";
import { Info } from "./widgets/info.js";
import { NierSliderButton } from "./nier/slider.js";
import { NierDropDownButton } from "./nier/dropdown.js";
import { NierSettingPane } from "./windows/settings.js";
import { NowPlaying } from "./widgets/nowplaying.js";
// import { NierDropDownButton } from "./nier/dropdown.js";

const { exec, subprocess, execAsync } = Utils;
const { Box, Window, Label, Revealer } = Widget;

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
        children: [
          NierDropDownButton({
            label: "test",
            current: Variable("YES", {}),
            options: Variable(["hello", "no"], {}),
          }),
          NierButton({
            handleClick: async (self, event) => {
              App.toggleWindow("settings");
            },
          }),
        ],
      }),
      Box({
        className: ["under-workspaces"],
        style: `background: url("${
          App.configDir + "/assets/nier-border.svg"
        }") repeat-x;min-width: ${SCREEN_WIDTH}px;background-size: 80px 20px;min-height: 80px;`,
        child: Label(""),
      }),
      // NowPlaying({}),
    ],
  });

const Bar = ({ monitor } = {}) => {
  return Window({
    name: `bar-${monitor}`, // name has to be unique
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
export default {
  closeWindowDelay: {
    settings: 500, // milliseconds
  },
  style: css,
  windows: [
    // BottomBar()
    Bar(),
    NierSettingPane(),
    Side(),
    // you can call it, for each monitor
    // Bar({ monitor: 0 }),
    // Bar({ monitor: 1 })
  ],
};
