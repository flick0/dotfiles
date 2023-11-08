import { Widget, Variable } from "../imports.js";
import { arradd, arrremove } from "../util.js";
import { NierButton } from "./buttons.js";
const { Box } = Widget;

const handle_value = (segments, boxes, value, active) => {
  for (let segment of segments) {
    segment.className = arrremove(segment.className, "focus");
    segment.className = arrremove(segment.className, "filled");
    segment.className = arrremove(segment.className, "focus-on-hold");
  }
  let segment_index = Math.floor(value * boxes) - 1;
  if (segment_index < 0) {
    return segments;
  }
  if (segment_index >= boxes) {
    segment_index = boxes - 1;
  }

  for (let segment of segments) {
    segment.className = arrremove(segment.className, "focus");
    segment.className = arrremove(segment.className, "filled");
  }
  for (let segment of segments) {
    if (segment.className.includes(`nier-slider-boxes-${segment_index}`)) {
      console.log("active????????? ", active);
      if (active) {
        segment.className = arradd(segment.className, "focus");
      } else {
        segment.className = arradd(segment.className, "filled");
        segment.className = arradd(segment.className, "focus-on-hold");
      }

      break;
    }
    segment.className = arradd(segment.className, "filled");
  }
};

export const NierSliderButton = ({
  label = "",
  className = [],
  containerClassName = [],
  containerConnections = [],
  connections = [],
  ratio = Variable(0, {}),
  boxes = 10,
  slider_padding = 20,
  onValueChange = async (self, value) => {},
  isDragging = false,
  hovering = false,
  size = 35,
  font_size = 20,
}) =>
  NierButton({
    label,
    homogeneous_button: true,
    containerClassName,
    containerConnections,
    size,
    font_size,
    // homogeneous_button: false,
    className: ["nier-slider-button", ...className],

    passedOnHover: async (self) => {
      hovering = true;
      let slider = self.child.centerWidget.children[1];
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
      hovering = false;
      if (isDragging) {
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
      isDragging = true;
      let slider = self.child.centerWidget.children[1];
      const [, x_pos] = event.get_coords();
      let x = x_pos;
      let alloc = slider.get_allocation();
      if (x >= alloc.x) {
        x = x - alloc.x;
        let sliderPos = (x / (alloc.width - slider_padding)) * boxes;
        let rawPos = Math.min(Math.max(sliderPos, 0), boxes);
        let value = rawPos / boxes;

        ratio.setValue(value);
        console.log("bar click is setting volume", ratio.value);
      }
    },
    handleClickRelease: async (self) => {
      isDragging = false;
    },
    handleMotion: async (self, event) => {
      let slider = self.child.centerWidget.children[1];
      const [, x_pos] = event.get_coords();
      let x = x_pos;
      let alloc = slider.get_allocation();
      x = x - alloc.x;
      let sliderPos = (x / (alloc.width - slider_padding)) * boxes;
      let rawPos = Math.min(Math.max(sliderPos, 0), boxes);
      let value = rawPos / boxes;
      ratio.setValue(value);
      console.log("bar move is setting volume", ratio.value);
    },
    children: [
      NierInertSlider({
        boxes: boxes,
        connections: [
          [
            ratio,
            (self) => {
              console.log("ratio changed", ratio.value);
              handle_value(self.children, boxes, ratio.value, hovering);
            },
          ],
          ...connections,
        ],
      }),
    ],
  });

export const NierInertSlider = ({
  boxes = 10,
  slider_padding = 20,
  connections = [],
}) =>
  Box({
    className: ["nier-slider"],
    homogeneous: false,
    halign: "end",
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
    connections: [...connections],
  });
