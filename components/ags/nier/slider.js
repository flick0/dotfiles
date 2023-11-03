import { Widget, App } from "../imports.js";
import { arradd, arrremove } from "../util.js";
const { Button, Label, Overlay, EventBox, Box, Scrollable, Icon, Slider } =
  Widget;

const { Gdk, Gtk } = imports.gi;

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
