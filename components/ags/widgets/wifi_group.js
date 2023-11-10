import { Widget, App, Utils, Network, Variable } from "../imports.js";
import { NierButtonGroup, NierButton } from "../nier/buttons.js";
import { NierSliderButton } from "../nier/slider.js";
import { NierDropDownButton } from "../nier/dropdown.js";
import { SCREEN_WIDTH, arradd, arrremove } from "../util.js";

const { Window, Label, EventBox, Box, Icon, Revealer } = Widget;
const { execAsync } = Utils;

export const WifiGroup = (
  enabled = Variable(Network.wifi.enabled ? "YES" : "NO", {}),
  current_ssid = Variable("", {}),
  current_networks = Variable(["loading..."], {}),
  go_to = (buttons, self) => {}
) => {
  return [
    Label({ halign: "start", label: "WIFI", className: ["heading"] }),
    NierDropDownButton({
      font_size: 40,
      label: "enabled",
      current: enabled,
      options: Variable(["YES", "NO"], {}),
      popup_x_offset: SCREEN_WIDTH / 4 + 20,
      connections: [
        [
          enabled,
          (self) => {
            Network.wifi.enabled = enabled.value == "YES";
          },
        ],
      ],
    }),
    NierDropDownButton({
      font_size: 40,
      label: "connect",
      current: current_ssid,
      options: current_networks,
      popup_x_offset: SCREEN_WIDTH / 4 + 20,
      setup: (self) => {},
      connections: [
        [
          10000,
          (self) => {
            current_ssid.setValue(Network.wifi.ssid);
            Network.wifi.scan();
            let done = [];
            current_networks.setValue(
              // remove duplicates
              Array.from(Network.wifi.access_points)
                .map((ap) => ap.ssid)
                .filter((ssid) => {
                  if (done.includes(ssid)) {
                    return false;
                  }
                  done.push(ssid);
                  return true;
                })
            );
          },
        ],
      ],
    }),
  ];
};
