import { Widget, App, Utils, Bluetooth, Variable } from "../imports.js";
import { NierButtonGroup, NierButton } from "../nier/buttons.js";
import { NierSliderButton } from "../nier/slider.js";
import { NierDropDownButton } from "../nier/dropdown.js";
import { SCREEN_WIDTH, arradd, arrremove } from "../util.js";

const { Window, Label, EventBox, Box, Icon, Revealer } = Widget;
const { execAsync } = Utils;

export const BluetoothGroup = (
  go_to = async (buttons, parent_button) => {},
  enabled = Variable(Bluetooth.enabled ? "YES" : "NO", {})
) => {
  return [
    Label({ hpack: "start", label: "BLUETOOTH", classNames: ["heading"] }),
    NierDropDownButton({
      font_size: 30,
      label: "enabled",
      current: enabled,
      options: Variable(["YES", "NO"], {}),
      popup_x_offset: SCREEN_WIDTH / 4,
      connections: [
        [
          enabled,
          (self) => {
            Bluetooth.enabled = enabled.value == "YES";
          },
        ],
      ],
    }),
    NierButton({
      font_size: 30,
      label: "devices",
      handleClick: async (self, event) => {
        go_to(
          [
            Label({
              hpack: "start",
              label: "DEVICES",
              classNames: ["heading"],
            }),
            ...Array.from(Bluetooth.devices).map((device) => {
              let device_options = Variable(["CONNECTED", "DISCONNECTED"], {});
              let device_current = Variable(
                device.connected ? "CONNECTED" : "DISCONNECTED",
                {}
              );
              return NierDropDownButton({
                label: device.name,
                current: device_current,
                options: device_options,
                popup_x_offset: (SCREEN_WIDTH / 4) * 2,
                connections: [
                  [
                    device_current,
                    (self) => {
                      if (device_current.value == "CONNECTED") {
                        device.setConnection(false);
                      } else {
                        device.setConnection(true);
                      }
                    },
                  ],
                ],
              });
            }),
          ],
          self
        );
      },
    }),
  ];
};
