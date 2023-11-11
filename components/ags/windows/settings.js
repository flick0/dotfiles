import { Widget, App, Audio } from "../imports.js";
import { NierButtonGroup, NierButton } from "../nier/buttons.js";
import { SCREEN_WIDTH, arradd, arrremove } from "../util.js";
import { BluetoothGroup } from "../widgets/bluetooth_group.js";
import { NowPlaying } from "../widgets/nowplaying.js";
import { VolumeGroup } from "../widgets/volume_group.js";
import { WifiGroup } from "../widgets/wifi_group.js";

const { Window, Label, EventBox, Box, Icon, Revealer } = Widget;

const { Gdk } = imports.gi;

const volume_page = (
  go_to = (buttons, parent_button) => {
    return [];
  }
) => {
  return VolumeGroup(go_to);
};

const wifi_page = (go_to = (button) => {}) => {
  return WifiGroup(go_to);
};

const bluetooth_page = (
  go_to = (buttons, parent_button) => {
    return [];
  }
) => {
  return BluetoothGroup(go_to);
};

const ensure_only_selected = async (button, page_button) => {
  if (button == page_button) {
    return button;
  }
  if (button) {
    button.child.className = arradd(
      button.child.className,
      "nier-button-box-selected"
    );
    button.parent.className = arradd(
      button.parent.className,
      "nier-button-container-selected"
    );
  }
  if (page_button) {
    remove_selected(page_button).catch((e) => {
      console.log(e);
    });
  }
  return button;
};

const remove_selected = async (button) => {
  console.log(button.className);
  if (button.child.className.includes("nier-button-box-selected")) {
    button.child.className = arrremove(
      button.child.className,
      "nier-button-box-selected"
    );
    button.parent.className = arrremove(
      button.parent.className,
      "nier-button-container-selected"
    );
    button.child.className = arradd(
      button.child.className,
      "nier-button-box-hover-from-selected"
    );
    button.parent.className = arradd(
      button.parent.className,
      "nier-button-container-hover-from-selected"
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    button.child.className = arrremove(
      button.child.className,
      "nier-button-box-hover-from-selected"
    );
    button.parent.className = arrremove(
      button.parent.className,
      "nier-button-container-hover-from-selected"
    );
  }
};

export const NierSettingPane = (
  padding_vertical = 50,
  current_page = 0,
  page1_selected = null,
  page2_selected = null,
  page3_selected = null
) =>
  Window({
    name: "settings",
    className: ["settings"],
    margin: [0, 0, 0, 0],
    anchor: ["top", "left", "bottom"],
    exclusive: false,
    layer: "top",
    focusable: true,
    visible: false,
    setup: (self) => {
      self.connect("key-press-event", async (widget, event) => {
        if (event.get_keyval()[1] == Gdk.KEY_Escape) {
          try {
            if (current_page == 0) {
              App.toggleWindow("settings");
            } else {
              let next_page = self.child.children[current_page].child;
              let now_page = self.child.children[current_page - 1].child;

              // let next_buttons = next_page.children[1].children;
              let now_buttons = now_page.children[1].children;

              next_page.className = arradd(next_page.className, "closing");
              switch (current_page) {
                case 1:
                  page1_selected = await ensure_only_selected(
                    null,
                    page1_selected
                  );
                  break;
                case 2:
                  page2_selected = await ensure_only_selected(
                    null,
                    page2_selected
                  );
                  break;
                case 3:
                  page3_selected = await ensure_only_selected(
                    null,
                    page3_selected
                  );
                  break;
              }
              now_buttons.forEach(async (_button) => {
                if (_button.className.includes("nier-button-container")) {
                  let button = _button.child.children[1];
                  await remove_selected(button).catch((e) => {
                    console.log(e);
                  });
                }
              });

              current_page = current_page - 1;
            }
          } catch (e) {
            console.log("EEEEEEEEEEEER", e);
            App.toggleWindow("settings");
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

        let page3 = NierButtonGroup({
          style: `min-width: ${SCREEN_WIDTH / 4}px`,
          containerClassName: ["nier-settings-3-container", "closing"],
          className: ["nier-settings-1"],

          buttons: [],
        });

        let page2 = NierButtonGroup({
          style: `min-width: ${SCREEN_WIDTH / 4}px`,
          containerClassName: ["nier-settings-2-container", "closing"],
          className: ["nier-settings-1"],

          buttons: [],
        });

        let go_page2 = async (buttons, parent_button) => {
          page1_selected = await ensure_only_selected(
            parent_button,
            page1_selected
          );
          page2.child.children[1].children = buttons;
          page4.child.className = arradd(page4.child.className, "closing");
          page3.child.className = arradd(page3.child.className, "closing");
          page2.child.className = arrremove(page2.child.className, "closing");

          current_page = 1;
        };
        let go_page3 = async (buttons, parent_button) => {
          page2_selected = await ensure_only_selected(
            parent_button,
            page2_selected
          );
          page3.child.children[1].children = buttons;
          page4.child.className = arradd(page4.child.className, "closing");
          page3.child.className = arrremove(page3.child.className, "closing");

          current_page = 2;
        };
        let go_page4 = async (buttons, parent_button) => {
          page3_selected = await ensure_only_selected(
            parent_button,
            page3_selected
          );
          page4.child.children[1].children = buttons;
          page4.child.className = arrremove(page4.child.className, "closing");

          current_page = 3;
        };

        let page1 = NierButtonGroup({
          style: `min-width: ${SCREEN_WIDTH / 4}px`,
          containerClassName: ["nier-settings-1-container"],
          className: ["nier-settings-1"],

          buttons: [
            Label({ halign: "start", label: "SYSTEM", className: ["heading"] }),
            NierButton({
              font_size: 30,
              label: "sound",
              handleClick: async (self, event) => {
                page1_selected = await ensure_only_selected(
                  self,
                  page1_selected
                );
                await go_page2(volume_page(go_page3), self).catch((e) => {
                  console.log(e);
                });
              },
            }),
            NierButton({
              font_size: 30,
              label: "wifi",
              handleClick: async (self, event) => {
                await go_page2(wifi_page(), self).catch((e) => {
                  console.log(e);
                });
              },
            }),
            NierButton({
              font_size: 30,
              label: "bluetooth",
              handleClick: async (self, event) => {
                await go_page2(bluetooth_page(go_page3), self).catch((e) => {
                  console.log(e);
                });
              },
            }),
            // NowPlaying({}),
          ],
        });
        self.children = [page1, page2, page3, page4];
      },
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
                self.className = arrremove(self.className, "opening");
                self.className = arradd(self.className, "closing");
              } else {
                self.className = arradd(self.className, "opening");
                containers[0].className = arrremove(
                  containers[0].className,
                  "closing"
                );
                self.className = arrremove(self.className, "closing");
              }
            }
          },
          "window-toggled",
        ],
      ],
    }),
  });
