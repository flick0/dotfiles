import { Widget, App } from "../imports.js";
import { arradd, arrremove } from "../util.js";
const { Button, Label, Overlay, EventBox, Box, Scrollable, Icon, CenterBox } =
  Widget;
const { GObject } = imports.gi;

export const NierButton = ({
  label = "",
  className = [],
  containerClassName = [],
  containerConnections = [],
  children = [],
  label_no_box = false,
  size = 35,
  font_size = 20,
  homogeneous_button = true,
  padding_right = size,
  passedParent = null,

  labelOveride = (label, font_size) =>
    Label({
      className: ["nier-button-label"],
      style: `font-size: ${font_size}px;`,
      label: "⬛ " + label,
      xalign: 0,
      justification: "left",
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
    setup: (self) => {
      self._eventbox = self.child.children[1];
      self._centerbox = self._eventbox.child;
      self._button = self._centerbox.centerWidget;
      self.passedParent = passedParent;
    },
    className: ["nier-button-container", ...containerClassName],
    connections: [...containerConnections],
    child: Box({
      // homogeneous: false,
      // halign: "center",
      valign: "center",
      children: [
        Icon({
          icon: App.configDir + "/assets/nier-pointer.svg",
          size: size,
          className: [
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

              button.className = arradd(button.className, "nier-button-hover");
              box.className = arradd(box.className, "nier-button-box-hover");
              cursor.className = [
                "nier-long-button-hover-icon",
                "nier-long-button-hover-icon-visible",
              ];
              top.className = arradd(top.className, "nier-button-top-hover");
              bottom.className = arradd(
                bottom.className,
                "nier-button-bottom-hover"
              );
              container.className = arradd(
                container.className,
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

              button.className = arrremove(
                button.className,
                "nier-button-hover"
              );
              box.className = arrremove(box.className, "nier-button-box-hover");
              cursor.className = [
                "nier-button-hover-icon",
                "nier-button-hover-icon-hidden",
              ];
              top.className = arrremove(top.className, "nier-button-top-hover");
              bottom.className = arrremove(
                bottom.className,
                "nier-button-bottom-hover"
              );
              container.className = arrremove(
                container.className,
                "nier-button-container-hover"
              );
            }
            return true;
          },
          setup: (self) => {
            setup(self);
            self.connect("button-press-event", (self, event) => {
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
          },

          child: CenterBox({
            // homogeneous: true,
            // halign: "fill",
            hexpand: true,
            vertical: true,
            className: ["nier-button-box"],
            startWidget: Box({
              className: ["nier-button-top"],
            }),
            centerWidget: Box({
              // halign: "justified",
              homogeneous: homogeneous_button,
              className: ["nier-button", ...className],
              children: [labelOveride(label, font_size), ...children],
              ...props,
            }),
            endWidget: Box({
              className: ["nier-button-bottom"],
            }),
          }),
        }),
        Box({
          className: ["nier-button-right-padding"],
          style: `min-width: ${padding_right}px;`,
        }),
      ],
    }),
  });

export const NierButtonGroup = ({
  heading = "",
  scrollable = false,
  className = [],
  containerClassName = [],
  buttons = [],
  style = "",
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
    setup: (self) => {
      self.passedParent = passedParent;
    },
    child: Box({
      className: ["nier-long-button-group-container", ...containerClassName],
      children: [
        Box({
          className: ["nier-long-button-group-ruler"],
        }),
        Box({
          // homogeneous: homogeneous_buttons,
          // halign: "fill",
          vertical: !horizontal,
          className: [
            horizontal
              ? "nier-long-button-group"
              : "nier-long-button-group-vertical",
            ...className,
          ],
          style: style,
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
      style: `${horizontal ? "min-width" : "min-height"}: ${min_scale}px;`,
      child: inner,
    });
  } else {
    return inner;
  }
};

export const NierLongButton = ({
  name = "",
  className = [],
  containerClassName = [],
  containerConnections = [],
  label = "",
  passedOnHoverLost = async (self) => {},
  passedOnHover = async (self) => {},

  ...props
}) =>
  Box({
    className: ["nier-long-button-container", ...containerClassName],
    connections: [...containerConnections],
    children: [
      Icon({
        icon: App.configDir + "/assets/nier-pointer.svg",
        size: 35,
        className: [
          "nier-long-button-hover-icon",
          "nier-long-button-hover-icon-hidden",
        ],
      }),
      Button({
        name,
        child: Label({
          label: "⬛ " + label,
          xalign: 0,
          justification: "left",
        }),
        onHover: (self) => {
          passedOnHover(self);
          self.className = arradd(self.className, "nier-long-button-hover");
          self.parent.children[0].className = [
            "nier-long-button-hover-icon",
            "nier-long-button-hover-icon-visible",
          ];
        },
        onHoverLost: (self) => {
          passedOnHoverLost(self);
          self.className = arrremove(self.className, "nier-long-button-hover");
          self.parent.children[0].className = [
            "nier-long-button-hover-icon",
            "nier-long-button-hover-icon-hidden",
          ];
        },
        className: ["nier-long-button", ...className],
        ...props,
      }),
    ],
  });
