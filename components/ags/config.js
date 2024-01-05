// importing
import {
  App,
  Widget,
  Utils,
} from "./imports.js";


import { arradd, arrremove, css, scss, assetsDir, dark, themedir,SCREEN_WIDTH} from "./util.js";
import { Workspaces } from "./widgets/workspace.js";
import { NierBorder } from "./widgets/nier_border.js";

const { exec, execAsync } = Utils;
const { Box, Window, Button, Icon } = Widget;

exec(`sassc ${scss} ${css}`);


const WHICH = "nier";
globalThis.WHICH = WHICH;


const top = () =>
  Box({
    vertical: true,
    classNames: ["top"],
    children: [
      Box({
        spacing: 20,
        hpack: "fill",
        css: `min-width: ${SCREEN_WIDTH}px;`,
        children: [
          Workspaces({}),
          Button({
            hpack: "end",
            hexpand: true,
            classNames: ["settings-button"],
            child: Icon({
              size: 40,
              icon: assetsDir() + "/yorha.png",
            }),
            setup: (button) => {
              button.connect("enter-notify-event" , (self) => {
                let right = button.parent.children[2];
                button.classNames = arradd(button.classNames, "hover");
                right.classNames = arradd(right.classNames, "hover");
              })
              button.connect("leave-notify-event" , (self) => {
                let right = button.parent.children[2];
                button.classNames = arrremove(button.classNames, "hover");
                right.classNames = arrremove(right.classNames, "hover");
              })
            },
            onClicked: () => {
              execAsync(`ags -b settings -t settings`)
            },
          }),
          Box({
            hpack: "start",
            classNames: ["yorha-right"],
          }),
        ],
      }),
      NierBorder({
        classNames: ["under-workspaces"],
      }),
    ],
  });

const Bar = ({ monitor } = {}) => {
  return Window({
    name: `bar`,
    classNames: ["bar"],
    monitor,
    margin: [0, 0],
    anchor: ["top", "left", "right"],
    exclusivity: "ignore",
    layer: "bottom",
    child: Box({
      css: "margin-top: 10px;",
      children: [top()],
    }),
  });
};

execAsync(`ags -b player -c ${App.configDir}/windows/player/player.js`);
execAsync(`ags -b settings -c ${App.configDir}/windows/settings/settings.js`);
dark.connect("changed", () => {
  print("dark changed",dark.value);
  let colors_css_path = `${App.configDir}/style/color.scss`;
  let colors_css = Utils.readFile(`${App.configDir}/style/color-${dark.value?'dark':'light'}.scss`)
  Utils.writeFile(colors_css,colors_css_path).then(() => {
    exec(`sassc ${scss} ${css}`);
    App.resetCss();
    App.applyCss(css);
    print("done")
  })
  .catch((e) => {
    print("error",e);
  });

  execAsync(`ags -b player -r dark.value=${dark.value}`).then(print);
  execAsync(`ags -b notify -r dark.value=${dark.value}`).then(print);
  execAsync(`ags -b settings -r dark.value=${dark.value}`).then(print);

  let hyprconf = Utils.readFile(`${themedir}/theme.conf`);
  if (dark.value) {
    hyprconf = hyprconf.replaceAll("nier_light","nier_dark");
  } else {
    hyprconf = hyprconf.replaceAll("nier_dark","nier_light");
  }
  Utils.writeFile(hyprconf,`${themedir}/theme.conf`).then(()=>{
    print("reloaded hypr")
  }).catch((e) => print("error",e));
}) 

execAsync(["bash","-c",`pkill dunst;ags -b notify -c ${App.configDir}/windows/notifications/notifications.js`])

const BottomBar = () =>
  Window({
    name: "bottombar",
    margin: [0, 0],
    anchor: ["bottom", "left", "right"],
    exclusivity: "ignore",
    layer: "bottom",
    child: NierBorder({
      classNames: ["bottombar"],
      y_axis: true,
    }),
  });

export default {
  style: css,
  windows: [
    Bar(),
    BottomBar(),
  ],
};
