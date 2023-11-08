import { Widget, App, Audio, Utils, Variable } from "../imports.js";
import { NierButtonGroup, NierButton } from "../nier/buttons.js";
import { NierSliderButton } from "../nier/slider.js";
import { SCREEN_WIDTH, arradd, arrremove } from "../util.js";

const { Window, Label, EventBox, Box, Icon, Revealer } = Widget;
const { execAsync } = Utils;

export const VolumeGroup = (volume_ratio = Variable(0.9, {})) => {
  let volume_slider = (type = "speaker") =>
    NierSliderButton({
      size: 50,
      font_size: 50,
      label: type,
      boxes: 20,
      ratio: volume_ratio,
      //   onValueChange: (self, value) => {
      //     Audio.speaker.volume = volume_ratio.value * 100;
      //   },
      connections: [
        [
          Audio,
          (self) => {
            // Audio.speaker and Audio.microphone can be undefined
            // to workaround this use the ? chain operator
            volume_ratio.setValue(Audio[type]?.volume || 0);
            // console.log(
            //   "system volume changed :: ",
            //   Audio[type]?.volume,
            //   volume_ratio.value
            // );
          },
          `${type}-changed`,
        ],
        [
          volume_ratio,
          (self) => {
            console.log("volume ratio changed :: ", volume_ratio.value);
            if (
              Math.round(Audio[type].volume * 1000) ==
              Math.round(volume_ratio.value * 1000)
            ) {
              return;
            }
            Audio[type].volume = volume_ratio.value;
          },
        ],
      ],
    });
  return [
    Label({ halign: "start", label: "VOLUME", className: ["heading"] }),
    NierButtonGroup({
      heading: "Volume",
      buttons: [volume_slider()],
    }),
    Label({ halign: "start", label: "OUTPUT", className: ["heading"] }),
    NierButtonGroup({
      heading: "Output",
      buttons: [],
    }),
    Label({ halign: "start", label: "INPUT", className: ["heading"] }),
    NierButtonGroup({
      heading: "Input",
    }),
  ];
};
