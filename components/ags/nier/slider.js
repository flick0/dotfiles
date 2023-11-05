import { Widget } from "../imports.js";
import { arradd, arrremove } from "../util.js";
import { NierButton } from "./buttons.js";
const { Box } = Widget;

const set_focus = (segments, index) => {
  console.log("index:: ", index);
  if (index == 0) {
    return segments;
  }
  for (let segment of segments) {
    if (segment.className.includes(`nier-slider-boxes-${index}`)) {
      segment.className = arradd(segment.className, "focus");
      break;
    }
    segment.className = arradd(segment.className, "filled");
  }
  return segments;
};

const calc_segment = (width, segments, x, slider_padding) => {
  let sliderPos = (x / (width - slider_padding)) * segments;
  let rawPos = Math.min(Math.max(sliderPos, 0), segments);
  let value = rawPos / segments;
  let segmentIndex = Math.round(rawPos);
  return { value, segmentIndex };
};

const handle_slider = (
  slider,
  event,
  boxes,
  slider_padding,
  onSliderChange
) => {
  let segments = slider.children;
  const [, x_pos] = event.get_coords();
  let x = x_pos;
  const offset = slider.parent.children[0].get_allocation().width;
  if (x >= offset) {
    x = x - offset;
    let { value, segmentIndex } = calc_segment(
      slider.get_allocation().width,
      boxes,
      x,
      slider_padding
    );
    console.log(x, value, segmentIndex);
    for (let segment of segments) {
      segment.className = arrremove(segment.className, "focus");
      segment.className = arrremove(segment.className, "filled");
    }
    onSliderChange(slider, value);
    set_focus(segments, segmentIndex <= 0 ? 0 : segmentIndex - 1);
  }
  return true;
};

export const NierSliderButton = ({
  label = "",
  className = [],
  containerClassName = [],
  containerConnections = [],
  //slider
  boxes = 10,
  slider_padding = 20,
  onValueChange = async (self, value) => {},
}) =>
  NierButton({
    label,
    containerClassName,
    containerConnections,
    className: ["nier-slider-button", ...className],

    passedOnHover: async (self) => {
      let slider = self.child.centerWidget.children[1];
      console.log("slider: ", slider.className);
      let segments = slider.children;
      for (let segment of segments) {
        if (segment.className.includes("focus-on-hold")) {
          segment.className = arradd(segment.className, "focus");
          segment.className = arrremove(segment.className, "filled");
          segment.className = arrremove(segment.className, "focus-on-hold");
          break;
        }
      }
      return true;
    },
    passedOnHoverLost: async (self) => {
      if (self.parent.isDragging) {
        return false;
      }
      let slider = self.child.centerWidget.children[1];
      let segments = slider.children;
      for (let segment of segments) {
        if (segment.className.includes("focus")) {
          segment.className = arradd(segment.className, "filled");
          segment.className = arradd(segment.className, "focus-on-hold");
          segment.className = arrremove(segment.className, "focus");
          break;
        }
      }
      return true;
    },
    handleClick: async (self, event) => {
      self.parent.isDragging = true;
      let slider = self.child.centerWidget.children[1];
      handle_slider(slider, event, boxes, slider_padding, onValueChange);
    },
    handleClickRelease: async (self) => {
      self.parent.isDragging = false;
    },
    handleMotion: async (self, event) => {
      console.log("motion");
      let slider = self.child.centerWidget.children[1];
      handle_slider(slider, event, boxes, slider_padding, onValueChange);
    },
    children: [NierInertSlider({})],
  });

export const NierInertSlider = ({ boxes = 10, slider_padding = 20 }) =>
  Box({
    className: ["nier-slider"],
    homogeneous: false,
    halign: "center",
    valign: "center",
    style: `padding-right: ${slider_padding}px;padding-left: 0px;`,
    children: [
      ...Array.from({ length: boxes }, (_, i) => i).map((i) => {
        return Box({
          child: Box({ className: ["inner"] }),
          className: ["nier-slider-boxes", `nier-slider-boxes-${i}`],
        });
      }),
      Box({ className: ["nier-slider-end"] }),
      Box({ className: ["nier-slider-size"] }),
    ],
  });
