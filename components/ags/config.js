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

import {
  NierLongButton,
  NierLongButtonGroup,
  NierToggle,
} from "./nier/buttons.js";

import { css, scss } from "./util.js";
import { Workspaces } from "./widgets/workspace.js";

Utils.exec(`sassc ${scss} ${css}`);

Utils.subprocess(
  [
    "inotifywait",
    "--recursive",
    "--event",
    "create,modify",
    "-m",
    App.configDir + "/style",
  ],
  () => {
    Utils.exec(`sassc ${scss} ${css}`);
    App.resetCss();
    App.applyCss(css);
  }
);

// const Workspaces = () =>
//   Widget.Box({
//     className: "workspaces",

//     children: Array.from({ length: 10 }, (_, i) => i + 1).map((i) =>
//       Widget.EventBox({
//         className: [`${i}`],
//         child: NierToggle({
//           name: `workspace-${i}`,
//           className: [`${i}`],
//           label: `${i}`,
//           size: 80,
//         }),
//         onPrimaryClick: (self) => {
//           Utils.execAsync(`hyprctl dispatch workspace ${i}`);
//         },
//       })
//     ),
//     connections: [
//       [
//         Hyprland,
//         (box) => {
//           //loop through children
//           for (const element of box.children) {
//             console.log(element.className, Hyprland.active.workspace.id);
//             if (element.className.includes(`${Hyprland.active.workspace.id}`)) {
//               element.child.className = ["nier-toggle-on", "workspace"];
//             } else {
//               element.child.className = ["nier-toggle-off"];
//             }
//           }
//         },
//       ],
//     ],
//   });

const Bar = ({ monitor } = {}) => {
  return Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    className: "bar",
    monitor,
    margin: [50, 50],
    anchor: ["top", "left", "right"],
    exclusive: true,
    layer: "top",
    child: Widget.Box({
      children: [Workspaces()],
    }),
  });
};
export default {
  style: css,
  windows: [
    // BottomBar()
    Bar(),
    // you can call it, for each monitor
    // Bar({ monitor: 0 }),
    // Bar({ monitor: 1 })
  ],
};
