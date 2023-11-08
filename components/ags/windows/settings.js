import { Widget, App, Audio } from "../imports.js";
import { NierButtonGroup, NierButton } from "../nier/buttons.js";
import { SCREEN_WIDTH, arradd, arrremove } from "../util.js";
import { VolumeGroup } from "../widgets/volume_group.js";

const { Window, Label, EventBox, Box, Icon, Revealer } = Widget;

const { Gdk } = imports.gi;

const volume_page2 = (go_to) => {
  return [...VolumeGroup()];
};

export const NierSettingPane = (padding_vertical = 50, current_page = 0) =>
  Window({
    name: "settings",
    className: ["settings"],
    margin: [0, 0, 0, 0],
    anchor: ["top", "left", "bottom"],
    exclusive: false,
    layer: "top",
    focusable: true,
    setup: (self) => {
      self.connect("key-press-event", (widget, event) => {
        console.log("keypress");
        if (event.get_keyval()[1] == Gdk.KEY_Escape) {
          if (current_page == 0) {
            App.toggleWindow("settings");
          } else {
            console.log(
              "page ",
              current_page,
              self.child.children[current_page].className
            );
            let next_page = self.child.children[current_page].child;
            next_page.className = arradd(next_page.className, "closing");
            current_page = current_page - 1;
          }
        }
      });
    },
    child: Box({
      className: ["nier-settings-container"],
      style: `min-width: ${SCREEN_WIDTH}px`,
      setup: (self) => {
        let page4 = NierButtonGroup({
          style: `min-width: ${SCREEN_WIDTH / 4}px`,
          containerClassName: ["nier-settings-4-container", "closing"],
          className: ["nier-settings-1"],

          buttons: [
            NierButton({
              label: "4",
              handleClick: async (button, event) => {
                App.toggleWindow("settings");
              },
            }),
          ],
        });

        let go_page4 = (buttons) => {
          page4.child.className = arrremove(page4.child.className, "closing");
          current_page = 3;
        };

        let page3 = NierButtonGroup({
          style: `min-width: ${SCREEN_WIDTH / 4}px`,
          containerClassName: ["nier-settings-3-container", "closing"],
          className: ["nier-settings-1"],

          buttons: [
            NierButton({
              label: "3",
              handleClick: async (button, event) => {
                go_page4([]);
              },
            }),
          ],
        });

        let go_page3 = (buttons) => {
          page4.child.className = arradd(page4.child.className, "closing");
          page3.child.className = arrremove(page3.child.className, "closing");
          current_page = 2;
        };

        let page2 = NierButtonGroup({
          style: `min-width: ${SCREEN_WIDTH / 4}px`,
          containerClassName: ["nier-settings-2-container", "closing"],
          className: ["nier-settings-1"],

          buttons: [
            NierButton({
              label: "2",
              handleClick: async (button, event) => {
                go_page3([]);
              },
            }),
          ],
        });

        let go_page2 = (buttons) => {
          page2.child.children[1].children = buttons;
          page4.child.className = arradd(page4.child.className, "closing");
          page3.child.className = arradd(page3.child.className, "closing");
          page2.child.className = arrremove(page2.child.className, "closing");
          current_page = 1;
        };

        let page1 = NierButtonGroup({
          style: `min-width: ${SCREEN_WIDTH / 4}px`,
          containerClassName: ["nier-settings-1-container"],
          className: ["nier-settings-1"],

          buttons: [
            Label({ halign: "start", label: "System", className: ["heading"] }),
            NierButton({
              size: 50,
              font_size: 50,
              label: "sound",
              handleClick: async (self, event) => {
                go_page2(volume_page2());
              },
            }),
          ],
        });
        self.children = [page1, page2, page3, page4];
      },
      // children: [
      //   NierButtonGroup({
      //     containerClassName: ["nier-settings-2-container", "closing"],
      //     className: ["nier-settings-2"],
      //     style: `min-width: ${SCREEN_WIDTH / 4}px`,
      //     heading: "CONNECTIVITY",
      //     buttons: [],
      //   }),
      //   NierButtonGroup({
      //     containerClassName: ["nier-settings-3-container", "closing"],
      //     className: ["nier-settings-3"],
      //     style: `min-width: ${SCREEN_WIDTH / 4}px`,
      //     heading: "CONNECTIVITY",
      //     buttons: [],
      //   }),
      //   NierButtonGroup({
      //     className: ["nier-settings-4"],
      //     containerClassName: ["nier-settings-4-container", "closing"],
      //     style: `min-width: ${SCREEN_WIDTH / 4}px`,
      //     heading: "CONNECTIVITY",
      //     buttons: [],
      //   }),
      // ],
      connections: [
        [
          App,
          (self, windowName, visible) => {
            if (windowName == self.parent.name) {
              let containers = Array.from(self.children).map((child) => {
                return child.child;
              });

              if (!visible) {
                containers.forEach((container) => {
                  container.className = arradd(container.className, "closing");
                });
                self.className = arradd(self.className, "closing");
              } else {
                containers[0].className = arrremove(
                  containers[0].className,
                  "closing"
                );
                self.className = arrremove(self.className, "closing");
              }
              // console.log(self.children[0].child.className);
              // self.child.children[0].style = `margin-left: -${SCREEN_WIDTH}px;transition: margin 0.3s ease;`;
            }
          },
          "window-toggled",
        ],
      ],
    }),
  });
