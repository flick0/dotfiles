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
} from "../imports.js";
import { NierButton, NierButtonGroup } from "../nier/buttons.js";

import { SCREEN_HEIGHT, SCREEN_WIDTH, arradd, arrremove } from "../util.js";

const { Box, Label, Icon, Button } = Widget;
const { execAsync } = Utils;

const SysTray = () =>
  Box({
    halign: "end",
    hexpand: true,
    className: ["sys-tray"],
    connections: [
      [
        SystemTray,
        (self) => {
          self.children = SystemTray.items.map((item) =>
            Button({
              className: ["sys-tray-item"],

              child: Icon({ binds: [["icon", item, "icon"]], size: 32 }),
              onPrimaryClick: (_, event) => item.activate(event),
              onSecondaryClick: (_, event) => item.openMenu(event),
              binds: [["tooltip-markup", item, "tooltip-markup"]],
            })
          );
        },
      ],
    ],
  });

export const Info = () =>
  Box({
    className: ["info"],
    children: [
      Label({
        className: ["time"],
        label: "00:00",
        connections: [
          [
            1000,
            (self) =>
              execAsync(["date", "+%I:%M"])
                .then((date) => (self.label = date))
                .catch(console.error),
          ],
        ],
      }),
      SysTray(),
    ],
  });
