import { Widget, Network, Variable } from "../imports.js";
import { NierDropDownButton } from "../nier/dropdown.js";
import { SCREEN_WIDTH,assetsDir } from "../util.js";

const { Label } = Widget;

export const WifiGroup = ({
  enabled = Variable(Network.wifi.enabled ? "YES" : "NO", {}),
  current_ssid = Variable("", {}),
  current_networks = Variable(["loading..."], {}),
  go_to = (buttons, self) => {},
  passAssetsDir = assetsDir
}) => {
  return [
    Label({ hpack: "start", label: "WIFI", classNames: ["heading"] }),
    NierDropDownButton({
      useAssetsDir: passAssetsDir,
      font_size: 30,
      label: "enabled",
      current: enabled,
      options: Variable(["YES", "NO"], {}),
      popup_x_offset: SCREEN_WIDTH / 4,
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
      useAssetsDir: passAssetsDir,
      font_size: 30,
      label: "connect",
      current: current_ssid,
      options: current_networks,
      popup_x_offset: SCREEN_WIDTH / 4,
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
