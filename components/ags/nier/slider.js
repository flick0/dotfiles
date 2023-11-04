import { Widget, App } from "../imports.js";
import { arradd, arrremove } from "../util.js";
const { Button, Label, Overlay, EventBox, Box, Scrollable, Icon, Slider } =
  Widget;

const { Gdk, Gtk } = imports.gi;

const set_focus = (buttons, index) => {
  console.log("index:: ", index);
  if (index == 0) {
    console.log("whoosh");
    return buttons;
  }
  for (let button of buttons) {
    if (button.className.includes(`nier-slider-boxes-${index}`)) {
      button.className = arradd(button.className, "focus");
      break;
    }
    button.className = arradd(button.className, "filled");
  }
  return buttons;
};

const calc_segment = (width, segments, x, slider_padding) => {
  let sliderPos = (x / (width - slider_padding)) * segments;
  let rawPos = Math.min(Math.max(sliderPos, 0), segments);
  let value = rawPos / segments;
  let segmentIndex = Math.round(rawPos);
  return { value, segmentIndex };
};

const handle_slider = (self, event, boxes, slider_padding, onSliderChange) => {
  console.log("motion");
  let buttons = self.child.children[1].children;
  let slider_container = self.child.children[1];
  const [never, x_pos, gonna] = event.get_coords();
  let x = x_pos;
  const offset = self.child.children[0].get_allocation().width;
  if (x >= offset) {
    x = x - offset;

    let { value, segmentIndex } = calc_segment(
      slider_container.get_allocation().width,
      boxes,
      x,
      slider_padding
    );
    console.log(x, value, segmentIndex);
    for (let button of buttons) {
      button.className = arrremove(button.className, "focus");
      button.className = arrremove(button.className, "filled");
    }
    onSliderChange(self, value);
    set_focus(buttons, segmentIndex <= 0 ? 0 : segmentIndex - 1);
  }
  return true;
};

export const NierSliderButton = ({
  name = "",
  className = [],
  containerClassName = [],
  containerConnections = [],
  label = "",
  passedOnHoverLost = async (self) => {},
  passedOnHover = async (self) => {},
  onSliderChange = async (self, value) => {},
  boxes = 10,
  slider_padding = 20,
  isDragging = false,
  ...props
}) =>
  Box({
    className: ["nier-slider-button-container", ...containerClassName],
    connections: [...containerConnections],
    child: Box({
      children: [
        Icon({
          icon: App.configDir + "/assets/nier-pointer.svg",
          size: 35,
          className: [
            "nier-long-button-hover-icon",
            "nier-long-button-hover-icon-hidden",
          ],
        }),
        Box({
          className: ["nier-slider-button-box"],
          child: Button({
            name,
            onHover: (self) => {
              passedOnHover(self);
              self.className = arradd(
                self.className,
                "nier-slider-button-hover"
              );
              self.parent.className = arradd(
                self.parent.className,
                "nier-slider-button-box-hover"
              );
              self.parent.parent.children[0].className = [
                "nier-long-button-hover-icon",
                "nier-long-button-hover-icon-visible",
              ];

              let buttons = self.child.children[1].children;
              for (let button of buttons) {
                if (button.className.includes("focus-on-hold")) {
                  button.className = arradd(button.className, "focus");
                  button.className = arrremove(button.className, "filled");
                  button.className = arrremove(
                    button.className,
                    "focus-on-hold"
                  );
                }
              }
              return true;
            },
            onHoverLost: (self) => {
              passedOnHoverLost(self);
              if (self.parent.parent.isDragging) {
                return;
              }
              self.className = arrremove(
                self.className,
                "nier-slider-button-hover"
              );
              self.parent.className = arrremove(
                self.parent.className,
                "nier-slider-button-box-hover"
              );
              self.parent.parent.children[0].className = [
                "nier-long-button-hover-icon",
                "nier-long-button-hover-icon-hidden",
              ];
              let buttons = self.child.children[1].children;
              for (let button of buttons) {
                if (button.className.includes("focus")) {
                  button.className = arradd(button.className, "filled");
                  button.className = arradd(button.className, "focus-on-hold");
                  button.className = arrremove(button.className, "focus");
                  return;
                }
              }
            },
            setup: (box) => {
              box.connect("button-press-event", (self, event) => {
                console.log("press");
                self.parent.parent.isDragging = true;
                handle_slider(
                  self,
                  event,
                  boxes,
                  slider_padding,
                  onSliderChange
                );
              });
              box.connect("button-release-event", (self) => {
                console.log("not drag");
                self.parent.parent.isDragging = false;
              });
              box.connect("motion-notify-event", (self, event) => {
                console.log("drag");
                handle_slider(
                  self,
                  event,
                  boxes,
                  slider_padding,
                  onSliderChange
                );
              });
            },
            child: Box({
              children: [
                Label({
                  label: "⬛ woaaaaA ",
                  xalign: 0,
                  justification: "left",
                }),
                Box({
                  className: ["nier-slider"],
                  style: `padding: ${slider_padding}px;padding-left: 0px;`,
                  children: [
                    ...Array.from({ length: boxes }, (_, i) => i).map((i) => {
                      return Button({
                        child: Box({ className: ["inner"] }),
                        className: [
                          "nier-slider-boxes",
                          `nier-slider-boxes-${i}`,
                        ],
                      });
                    }),
                    Box({ className: ["nier-slider-end"] }),
                    Box({ className: ["nier-slider-size"] }),
                  ],
                }),
              ],
            }),
            className: ["nier-slider-button", ...className],
            ...props,
          }),
        }),
      ],
    }),
  });

export const NierSlider = (
  min = 0,
  max = 100,
  value = 0,
  vertical = false,
  boxes = 100,
  isDragging = false
) =>
  Box({
    className: ["nier-slider"],
    child: Box({
      children: [
        ...Array.from({ length: boxes }, (_, i) => i).map((i) => {
          return Button({
            child: Box({ className: ["inner"] }),
            className: ["nier-slider-boxes", `nier-slider-boxes-${i}`],
            onPrimaryClick: async (self) => {
              let buttons = self.parent.children;
              for (let button of buttons) {
                button.className = arrremove(button.className, "filled");
              }
              for (let button of buttons) {
                button.className = arrremove(button.className, "focus");
                button.className = arrremove(button.className, "filled");
              }
              for (let button of buttons) {
                if (button.className.includes(`nier-slider-boxes-${i}`)) {
                  button.className = arradd(button.className, "focus");
                  break;
                }
                button.className = arradd(button.className, "filled");
              }
            },
            setup: (button) => {
              button.connect("button-press-event", (self, event) => {
                console.log("drag");
                self.parent.isDragging = true;
                return true;
              });
              button.connect("button-release-event", (self) => {
                console.log("not drag");
                self.parent.isDragging = false;
              });
              button.connect("motion-notify-event", (self, event) => {
                const [never, x, gonna] = event.get_coords();
                const allocation = self.get_allocation();
                const sliderPos =
                  (allocation.x + x) / allocation.width -
                  self.parent.children[
                    self.parent.children.length - 2
                  ].get_allocation().width;
                const rawPos = Math.min(Math.max(sliderPos, 0), boxes);
                const value = rawPos / boxes;
                const segmentIndex = Math.round(rawPos);
                let buttons = self.parent.children;
                for (let button of buttons) {
                  button.className = arrremove(button.className, "focus");
                  button.className = arrremove(button.className, "filled");
                }
                for (let button of buttons) {
                  console.log(rawPos, segmentIndex, value);
                  if (
                    button.className.includes(
                      `nier-slider-boxes-${segmentIndex}`
                    )
                  ) {
                    break;
                  }
                  if (
                    button.className.includes(
                      `nier-slider-boxes-${segmentIndex - 1}`
                    )
                  ) {
                    button.className = arradd(button.className, "focus");
                  } else {
                    button.className = arradd(button.className, "filled");
                  }
                }
              });
            },
          });
        }),
        Box({ className: ["nier-slider-end"] }),
        Box({ className: ["nier-slider-size"] }),
      ],
    }),
  });
