import { Widget, App, Utils } from "../imports.js";
import { arradd, arrremove } from "../util.js";
const { Button, Label, Overlay, EventBox, Box, Scrollable, Icon, CenterBox } =
  Widget;
const { GObject } = imports.gi;
const Pango = imports.gi.Pango;

export const NierButton = ({
  label = "",
  classNames = [],
  containerClassNames = [],
  containerConnections = [],
  children = [],
  label_no_box = false,
  size = 35,
  font_size = 20,
  homogeneous_button = true,
  passedParent = null,
  select_on_click = false,
  siblings = null,
  multiple_selected_siblings = false,
  max_label_chars = 20,
  container_style = "",

  labelOveride = (label, font_size, max_label_chars) =>
    Label({
      classNames: ["nier-button-label"],
      css: `font-size: ${font_size}px;`,
      label: "⬛ " + label,
      xalign: 0,
      justification: "left",
      wrap: true,
      max_width_chars: max_label_chars,
      setup: (self) =>
        Utils.timeout(1, () => {
          self.set_line_wrap_mode(Pango.WrapMode.WORD_CHAR);
          self.set_ellipsize(Pango.EllipsizeMode.END);
        }),
    }),

  passedOnHoverLost = async (self) => {
    return true;
  },
  passedOnHover = async (self) => {
    return true;
  },
  handleMotion = async (self, event) => {},
  handleClick = async (self, event) => {},
  handleClickRelease = async (self) => {},
  setup = (self) => {},
  overlays = [],
  ...props
}) =>
  Overlay({
    // setup: (self) => Utils.timeout(1, () => {
    //   self.passedParent = passedParent;
    // }),

    classNames: ["nier-button-container", ...containerClassNames],
    connections: [...containerConnections],
    child: Box({
      css: container_style,
      // homogeneous: false,
      // hpack: "center",
      vpack: "center",
      children: [
        Icon({
          icon: App.configDir + "/assets/nier-pointer.svg",
          size: size,
          classNames: [
            "nier-button-hover-icon",
            "nier-button-hover-icon-hidden",
          ],
        }),
        EventBox({
          // homogeneous: true,
          onHover: async (self) => {
            let continutehover = passedOnHover(self).catch((e) => {
              console.log(e);
              return false;
            });
            if (await continutehover) {
              let top = self.child.startWidget;
              let button = self.child.centerWidget;
              let bottom = self.child.endWidget;
              let box = self.child;
              let cursor = self.parent.children[0];
              let container = self.parent;

              button.classNames = arradd(
                button.classNames,
                "nier-button-hover"
              );
              box.classNames = arradd(box.classNames, "nier-button-box-hover");
              cursor.classNames = [
                "nier-long-button-hover-icon",
                "nier-long-button-hover-icon-visible",
              ];
              top.classNames = arradd(top.classNames, "nier-button-top-hover");
              bottom.classNames = arradd(
                bottom.classNames,
                "nier-button-bottom-hover"
              );
              container.classNames = arradd(
                container.classNames,
                "nier-button-container-hover"
              );
            }
            return true;
          },
          onHoverLost: async (self) => {
            let continutehover = await passedOnHoverLost(self).catch((e) => {
              console.log(e);
              return false;
            });
            if (continutehover) {
              let top = self.child.startWidget;
              let button = self.child.centerWidget;
              let bottom = self.child.endWidget;
              let box = self.child;
              let cursor = self.parent.children[0];
              let container = self.parent;

              button.classNames = arrremove(
                button.classNames,
                "nier-button-hover"
              );
              box.classNames = arrremove(
                box.classNames,
                "nier-button-box-hover"
              );
              cursor.classNames = [
                "nier-button-hover-icon",
                "nier-button-hover-icon-hidden",
              ];
              top.classNames = arrremove(
                top.classNames,
                "nier-button-top-hover"
              );
              bottom.classNames = arrremove(
                bottom.classNames,
                "nier-button-bottom-hover"
              );
              container.classNames = arrremove(
                container.classNames,
                "nier-button-container-hover"
              );
            }
            return true;
          },
          setup: (self) =>
            Utils.timeout(1, () => {
              setup(self);
              self.connect("button-press-event", (self, event) => {
                if (select_on_click) {
                  if (siblings && !multiple_selected_siblings) {
                    for (let button of siblings) {
                      if (button.classNames.includes("nier-button-container")) {
                        let child = button.child.children[1];
                        child.classNames = arrremove(
                          child.classNames,
                          "nier-button-box-selected"
                        );
                      }
                    }
                  }
                  self.child.classNames = arradd(
                    self.child.classNames,
                    "nier-button-box-selected"
                  );
                }

                handleClick(self, event).catch((e) => {
                  console.log(e);
                });
              });
              self.connect("button-release-event", (self) => {
                handleClickRelease(self).catch((e) => {
                  console.log(e);
                });
              });
              self.connect("motion-notify-event", (self, event) => {
                handleMotion(self, event).catch((e) => {
                  console.log(e);
                });
              });
            }),

          child: CenterBox({
            // homogeneous: true,
            // hpack: "fill",
            hexpand: true,
            vertical: true,
            classNames: ["nier-button-box"],
            startWidget: Box({
              classNames: ["nier-button-top"],
            }),
            centerWidget: Box({
              // hpack: "justified",
              homogeneous: homogeneous_button,
              classNames: ["nier-button", ...classNames],
              children: [
                labelOveride(label, font_size, max_label_chars),
                ...children,
              ],
              ...props,
            }),
            endWidget: Box({
              classNames: ["nier-button-bottom"],
            }),
          }),
        }),
      ],
    }),
  });

export const NierButtonGroup = ({
  heading = "",
  scrollable = false,
  classNames = [],
  containerClassNames = [],
  buttons = [],
  style = "",
  spacing = 10,
  // homogeneous_buttons = true,
  horizontal = false,
  min_scale = 200,
  passedParent = null,
  passedOnHover = async (self) => {
    return true;
  },
  passedOnHoverLost = async (self) => {
    return true;
  },
  ...props
}) => {
  let inner = EventBox({
    onHover: async (self) => {
      passedOnHover(self).catch((e) => {
        console.log(e);
      });
      return true;
    },
    onHoverLost: async (self) => {
      passedOnHoverLost(self).catch((e) => {
        console.log(e);
      });
      return true;
    },
    child: Box({
      classNames: ["nier-long-button-group-container", ...containerClassNames],
      children: [
        Box({
          classNames: ["nier-long-button-group-ruler"],
        }),
        Box({
          // homogeneous: homogeneous_buttons,
          // hpack: "fill",
          vertical: !horizontal,
          classNames: [
            horizontal
              ? "nier-long-button-group"
              : "nier-long-button-group-vertical",
            ...classNames,
          ],
          css: style,
          spacing,
          children: [...buttons],
        }),
      ],
      ...props,
    }),
  });
  if (scrollable) {
    return Scrollable({
      hscroll: horizontal ? "always" : "never",
      vscroll: horizontal ? "never" : "always",
      css: `${horizontal ? "min-width" : "min-height"}: ${min_scale}px;`,
      child: inner,
    });
  } else {
    return inner;
  }
};

export const NierLongButton = ({
  name = "",
  classNames = [],
  containerClassNames = [],
  containerConnections = [],
  label = "",
  label_prefix = "⬛",
  passedOnHoverLost = async (self) => {},
  passedOnHover = async (self) => {},

  ...props
}) =>
  Box({
    classNames: ["nier-long-button-container", ...containerClassNames],
    connections: [...containerConnections],
    children: [
      Icon({
        icon: App.configDir + "/assets/nier-pointer.svg",
        size: 35,
        classNames: [
          "nier-long-button-hover-icon",
          "nier-long-button-hover-icon-hidden",
        ],
      }),
      Button({
        name,
        child: Label({
          label: `${label_prefix} ` + label,
          xalign: 0,
          justification: "left",
        }),
        onHover: (self) => {
          passedOnHover(self);
          self.classNames = arradd(self.classNames, "nier-long-button-hover");
          self.parent.children[0].classNames = [
            "nier-long-button-hover-icon",
            "nier-long-button-hover-icon-visible",
          ];
        },
        onHoverLost: (self) => {
          passedOnHoverLost(self);
          self.classNames = arrremove(
            self.classNames,
            "nier-long-button-hover"
          );
          self.parent.children[0].classNames = [
            "nier-long-button-hover-icon",
            "nier-long-button-hover-icon-hidden",
          ];
        },
        classNames: ["nier-long-button", ...classNames],
        ...props,
      }),
    ],
  });
