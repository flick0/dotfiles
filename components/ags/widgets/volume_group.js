import { Widget,Audio,Variable } from "../imports.js";
import {  NierButton } from "../nier/buttons.js";
import { NierSliderButton } from "../nier/slider.js";
import { assetsDir } from "../util.js";

const {Label} = Widget;

let volume_slider = ({ volume_ratio = 0, type = "speaker", stream = null, useAssetsDir }) =>
  NierSliderButton({
    useAssetsDir,
    label: stream ? stream.description : type,
    boxes: 20,
    font_size: 30,
    ratio: volume_ratio,
    connections: [
      [
        Audio,
        (self) => {
          volume_ratio.setValue(
            stream ? stream.volume || 0 : Audio[type]?.volume || 0
          );
        },
        `${type}-changed`,
      ],
      [
        volume_ratio,
        (self) => {
          if (
            Math.round(
              stream ? stream.volume || 0 : Audio[type].volume * 100
            ) == Math.round(volume_ratio.value * 100)
          ) {
            return;
          }
          if (stream) {
            stream.volume = volume_ratio.value;
          } else {
            Audio[type].volume = volume_ratio.value;
          }
        },
      ],
    ],
  });

export const VolumeGroup = ({
  go_to = async (buttons, parent_button) => {},
  volume_ratio = Variable(0.0, {}),
  mic_volume_ratio = Variable(0.0, {}),
  passAssetsDir = assetsDir
}) => {
  return [
    Label({ hpack: "start", label: "VOLUME", classNames: ["heading"] }),
    volume_slider({useAssetsDir: passAssetsDir, type: "speaker", volume_ratio: volume_ratio }),
    volume_slider({useAssetsDir: passAssetsDir, type: "microphone", volume_ratio: mic_volume_ratio }),
    NierButton({
      useAssetsDir: passAssetsDir,
      container_style: "padding-top: 40px;",
      label: "Applications",
      font_size: 30,
      vpack: "end",
      handleClick: async (self, event) => {
        await go_to(
          [
            Label({ hpack: "start", label: "APPS", classNames: ["heading"] }),
            ...Array.from(Audio.apps).map((stream) => {
              console.log(stream);
              return volume_slider({
                useAssetsDir: passAssetsDir,
                stream: stream,
                volume_ratio: Variable(stream.volume || 0, {}),
              });
            }),
          ],

          self
        );
      },
    }),
    Label({ hpack: "start", label: "OUTPUT", classNames: ["heading"] }),
    ...Array.from(Audio.speakers).map((stream) => {
      console.log(stream);
      return volume_slider({
        useAssetsDir: passAssetsDir,
        stream: stream,
        volume_ratio: Variable(stream.volume || 0, {}),
      });
    }),

    Label({ hpack: "start", label: "INPUT", classNames: ["heading"] }),
    ...Array.from(Audio.microphones).map((stream) => {
      console.log(stream);
      return volume_slider({
        useAssetsDir: passAssetsDir,
        stream: stream,
        volume_ratio: Variable(stream.volume || 0, {}),
      });
    }),
  ];
};
