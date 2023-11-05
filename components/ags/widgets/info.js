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

const { Box, Label } = Widget;
const { execAsync } = Utils;

let HOVERING = false;
let REALLY_HOVERING = false;
export const Info = () =>
  Box({
    child: Label("hlo"),
  });
