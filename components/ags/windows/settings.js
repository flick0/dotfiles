import { Widget, App, Audio, Utils } from "../imports.js";
import { NierButtonGroup, NierButton } from "../nier/buttons.js";
import { SCREEN_WIDTH, arradd, arrremove, get_cursor } from "../util.js";
import { BluetoothGroup } from "../widgets/bluetooth_group.js";
import { Info } from "../widgets/info.js";
import { NowPlaying } from "../widgets/nowplaying.js";
import { VolumeGroup } from "../widgets/volume_group.js";
import { WifiGroup } from "../widgets/wifi_group.js";
// import { AppLauncher } from "./applauncher.js";

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

const ensure_only_selected = (button, page_button) => {
  if (button == page_button) {
    return button;
  }
  if (button) {
    button.child.classNames = arradd(
      button.child.classNames,
      "nier-button-box-selected"
    );
    button.parent.classNames = arradd(
      button.parent.classNames,
      "nier-button-container-selected"
    );
  }
  if (page_button) {
    Promise.resolve(
      remove_selected(page_button).catch((e) => {
        console.log(e);
      })
    );
  }
  return button;
};

const remove_selected = async (button) => {
  console.log(button.classNames);
  if (button.child.classNames.includes("nier-button-box-selected")) {
    button.child.classNames = arrremove(
      button.child.classNames,
      "nier-button-box-selected"
    );
    button.parent.classNames = arrremove(
      button.parent.classNames,
      "nier-button-container-selected"
    );
    button.child.classNames = arradd(
      button.child.classNames,
      "nier-button-box-hover-from-selected"
    );
    button.parent.classNames = arradd(
      button.parent.classNames,
      "nier-button-container-hover-from-selected"
    );
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    button.child.classNames = arrremove(
      button.child.classNames,
      "nier-button-box-hover-from-selected"
    );
    button.parent.classNames = arrremove(
      button.parent.classNames,
      "nier-button-container-hover-from-selected"
    );
  }
};

export const NierSettingPane = (
  padding_vertical = 50,
  current_page = 0,
  CLICK_TIMEOUT = false,
  page1_selected = null,
  page2_selected = null,
  page3_selected = null
) =>
  Window({
    name: "settings",
    classNames: ["settings"],
    margin: [0, 0, 0, 0],
    anchor: ["top", "left", "bottom"],
    exclusivity: "ignore",
    layer: "overlay",
    focusable: true,
    visible: false,
    setup: (self) =>
      Utils.timeout(1, () => {
        self.connect("key-press-event", (widget, event) => {
          if (event.get_keyval()[1] == Gdk.KEY_Escape) {
            try {
              if (current_page == 0) {
                App.toggleWindow("settings");
              } else {
                let next_page = self.child.child.children[current_page].child;
                let now_page =
                  self.child.child.children[current_page - 1].child;
                // let next_buttons = next_page.children[1].children;
                let now_buttons = now_page.children[1].children;
                next_page.classNames = arradd(next_page.classNames, "closing");
                switch (current_page) {
                  case 1:
                    page1_selected = ensure_only_selected(null, page1_selected);
                    break;
                  case 2:
                    page2_selected = ensure_only_selected(null, page2_selected);
                    break;
                  case 3:
                    page3_selected = ensure_only_selected(null, page3_selected);
                    break;
                }
                now_buttons.forEach(async (_button) => {
                  if (_button.classNames.includes("nier-button-container")) {
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
          return false;
        });
      }),
    child: EventBox({
      on_primary_click: async (self, event) => {
        if (CLICK_TIMEOUT) {
          return;
        }
        CLICK_TIMEOUT = true;
        Utils.timeout(300, () => {
          CLICK_TIMEOUT = false;
        });
        let [x, _] = await get_cursor();

        if (x <= (SCREEN_WIDTH / 4) * (current_page + 1)) {
          return;
        }
        try {
          if (current_page == 0) {
            App.toggleWindow("settings");
          } else {
            let next_page = self.child.children[current_page].child;
            let now_page = self.child.children[current_page - 1].child;

            let now_buttons = now_page.children[1].children;
            next_page.classNames = arradd(next_page.classNames, "closing");
            switch (current_page) {
              case 1:
                page1_selected = ensure_only_selected(null, page1_selected);
                break;
              case 2:
                page2_selected = ensure_only_selected(null, page2_selected);
                break;
              case 3:
                page3_selected = ensure_only_selected(null, page3_selected);
                break;
            }
            now_buttons.forEach(async (_button) => {
              if (_button.classNames.includes("nier-button-container")) {
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
      },
      child: Box({
        classNames: ["nier-settings-container"],
        css: `min-width: ${SCREEN_WIDTH}px`,

        setup: (self) =>
          Utils.timeout(1, () => {
            let page4 = NierButtonGroup({
              css: `min-width: ${SCREEN_WIDTH / 4}px`,
              containerClassNames: ["nier-settings-4-container", "closing"],
              classNames: ["nier-settings-1"],

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
              css: `min-width: ${SCREEN_WIDTH / 4}px`,
              containerClassNames: ["nier-settings-3-container", "closing"],
              classNames: ["nier-settings-1"],

              buttons: [],
            });

            let page2 = NierButtonGroup({
              css: `min-width: ${SCREEN_WIDTH / 4}px`,
              containerClassNames: ["nier-settings-2-container", "closing"],
              classNames: ["nier-settings-1"],

              buttons: [],
            });

            let go_page2 = async (buttons, parent_button) => {
              page1_selected = ensure_only_selected(
                parent_button,
                page1_selected
              );
              page2.child.children[1].children = buttons;
              page4.child.classNames = arradd(
                page4.child.classNames,
                "closing"
              );
              page3.child.classNames = arradd(
                page3.child.classNames,
                "closing"
              );
              page2.child.classNames = arrremove(
                page2.child.classNames,
                "closing"
              );

              current_page = 1;
            };
            let go_page3 = async (buttons, parent_button) => {
              page2_selected = ensure_only_selected(
                parent_button,
                page2_selected
              );
              page3.child.children[1].children = buttons;
              page4.child.classNames = arradd(
                page4.child.classNames,
                "closing"
              );
              page3.child.classNames = arrremove(
                page3.child.classNames,
                "closing"
              );

              current_page = 2;
            };
            let go_page4 = async (buttons, parent_button) => {
              page3_selected = ensure_only_selected(
                parent_button,
                page3_selected
              );
              page4.child.children[1].children = buttons;
              page4.child.classNames = arrremove(
                page4.child.classNames,
                "closing"
              );

              current_page = 3;
            };

            let page1 = NierButtonGroup({
              css: `min-width: ${SCREEN_WIDTH / 4}px`,
              containerClassNames: ["nier-settings-1-container"],
              classNames: ["nier-settings-1"],

              buttons: [
                Label({
                  hpack: "start",
                  label: "SYSTEM",
                  classNames: ["heading"],
                }),
                NierButton({
                  font_size: 30,
                  label: "sound",
                  handleClick: async (self, event) => {
                    page1_selected = ensure_only_selected(self, page1_selected);
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
                    await go_page2(bluetooth_page(go_page3), self).catch(
                      (e) => {
                        console.log(e);
                      }
                    );
                  },
                }),
                Label({
                  hpack: "start",
                  label: "APPS",
                  classNames: ["heading"],
                }),
                // AppLauncher(),
                Info(),
                // NowPlaying({}),
              ],
            });
            self.children = [page1, page2, page3, page4];
          }),
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
                    container.classNames = arradd(
                      container.classNames,
                      "closing"
                    );
                  });
                  self.classNames = arrremove(self.classNames, "opening");
                  self.classNames = arradd(self.classNames, "closing");
                } else {
                  self.classNames = arradd(self.classNames, "opening");
                  containers[0].classNames = arrremove(
                    containers[0].classNames,
                    "closing"
                  );
                  self.classNames = arrremove(self.classNames, "closing");
                }
              }
            },
            "window-toggled",
          ],
        ],
      }),
    }),
  });
