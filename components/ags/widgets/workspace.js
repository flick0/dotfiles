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
import { NierLongButton, NierButtonGroup } from "../nier/buttons.js";

import { SCREEN_HEIGHT, SCREEN_WIDTH, arradd, arrremove } from "../util.js";

const { Box, Label } = Widget;
const { execAsync } = Utils;

const int_to_string = (i) => {
  switch (i) {
    case 1:
      return "いち";
    case 2:
      return "に";
    case 3:
      return "さん";
    case 4:
      return "し";
    case 5:
      return "ご";
    case 6:
      return "ろく";
    case 7:
      return "しち";
    case 8:
      return "はちt";
    case 9:
      return "きゅう";
    case 10:
      return "じゅう";
  }
};

let HOVERING = false;
let REALLY_HOVERING = false;
export const Workspaces = () =>
  NierButtonGroup({
    horizontal: true,
    min_scale: SCREEN_WIDTH,
    className: ["workspaces"],
    buttons: Array.from({ length: 10 }, (_, i) => i + 1).map((i) => {
      return NierLongButton({
        className: ["workspace-button"],
        containerClassName: [
          "workspace-button-container",
          `workspace-button-${i}`,
        ],
        label: `${int_to_string(i).toUpperCase()}`,
        onClicked: () => {
          execAsync(`hyprctl dispatch workspace ${i}`);
        },
        passedOnHover: async (self) => {
          if (
            !(
              self.parent.className.includes("active") ||
              self.parent.className.includes("active-no-hover")
            )
          ) {
            HOVERING = true;
            REALLY_HOVERING = true;
          }
          if (HOVERING) {
            for (let button of self.parent.parent.children) {
              if (
                button.className.includes("active") ||
                button.className.includes("active-no-hover")
              ) {
                button.className = arrremove(
                  button.className,
                  "active-no-hover"
                );
                button.className = arrremove(button.className, "active");
                button.className = arradd(
                  button.className,
                  "active-no-hover-on-hold"
                );
              }
            }
          }
        },
        passedOnHoverLost: async (self) => {
          if (!self.className.includes("active")) {
            HOVERING = false;
            await new Promise((r) => setTimeout(r, 300));
            if (!HOVERING && REALLY_HOVERING) {
              REALLY_HOVERING = false;
            }
          }
          if (!HOVERING) {
            for (let button of self.parent.parent.children) {
              if (button.className.includes("active-on-hold")) {
                button.className = arrremove(
                  button.className,
                  "active-on-hold"
                );
                button.className = arradd(button.className, "active");
              }
              if (button.className.includes("active-no-hover-on-hold")) {
                button.className = arrremove(
                  button.className,
                  "active-no-hover-on-hold"
                );
                button.className = arradd(button.className, "active-no-hover");
              }
            }
          }
        },
        containerConnections: [
          [
            Hyprland.active.workspace,

            async (self) => {
              console.log(
                "workspacec changed to :: ",
                Hyprland.active.workspace.id
              );
              if (
                !self.className.includes(
                  `workspace-button-${Hyprland.active.workspace.id}`
                )
              ) {
                self.className = arrremove(self.className, "active-on-hold");
                self.className = arrremove(
                  self.className,
                  "active-no-hover-on-hold"
                );
                self.className = arrremove(self.className, "active");
                self.className = arrremove(self.className, "active-no-hover");
                self.children[0].icon =
                  App.configDir + "/assets/nier-pointer.svg";
              } else {
                if (
                  !self.children[1].className.includes("nier-long-button-hover")
                ) {
                  self.className = arradd(self.className, "active-no-hover");
                } else {
                  self.children[1].className = arrremove(
                    self.children[1].className,
                    "nier-long-button-hover"
                  );
                  self.className = arradd(self.className, "active");
                }
                await new Promise((r) => setTimeout(r, 300));
                self.children[0].icon =
                  App.configDir + "/assets/nier-pointer-white.svg";
              }
            },
          ],
        ],
      });
    }),
  });
