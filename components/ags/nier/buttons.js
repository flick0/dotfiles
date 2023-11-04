import { Widget, App } from "../imports.js";
import { arradd, arrremove } from "../util.js";
const { Button, Label, Overlay, EventBox, Box, Scrollable, Icon } = Widget;

export const NierLongButtonGroup = ({
  heading = "",
  scrollable = false,
  className = [],
  buttons = [],
  horizontal = false,
  min_scale = 200,
  ...props
}) => {
  let inner = Box({
    children: [
      Box({
        className: ["nier-long-button-group-ruler"],
      }),
      Box({
        vertical: !horizontal,
        className: [
          horizontal
            ? "nier-long-button-group"
            : "nier-long-button-group-vertical",
          ...className,
        ],
        children: [...buttons],
      }),
    ],
    ...props,
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

export const NierShortButton = ({ name, className, label, ...props }) =>
  Button({
    name,
    className: ["nier-short-button", ...className],
    ...props,
  });

export const NierToggle = ({
  name,
  className,
  label,
  _value = "",
  state = false,
  size = 70,
  ...props
}) =>
  Button({
    name,
    className: ["nier-toggle", ...className],
    child: Icon({
      icon: App.configDir + "/assets/nier-border.svg",
      size: size,
    }),
    ...props,
  });
