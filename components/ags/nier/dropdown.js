import { Widget, App, Variable } from "../imports.js";
import { arradd, arrremove } from "../util.js";
import { NierButton } from "./buttons.js";
const { Gdk } = imports.gi;
const { Window, Label, EventBox, Box, Icon } = Widget;

export const NierDropDownButton = ({
  label = "",
  className = [],
  containerClassName = [],
  containerConnections = [],
  passedOnHoverLost = async (self) => {
    return true;
  },
  passedOnHover = async (self) => {
    return true;
  },
  options = Variable([], {}),
  size = 35,
  current = Variable("", {}),
  popup_window = null,
  in_focus = false,
  popup_in_focus = false,
  popup_x_offset = 0,
  ...props
}) =>
  NierButton({
    label,
    className: ["nier-dropdown-button", ...className],
    containerClassName: [
      "nier-dropdown-button-container",
      ...containerClassName,
    ],
    containerConnections,
    passedOnHoverLost: async (self) => {
      console.log("hover lost");
      self.child.className = arrremove(
        self.child.className,
        "nier-button-box-hover-from-selected"
      );
      return true;
    },
    handleClick: async (self, event) => {
      self.child.className = arradd(
        self.child.className,
        "nier-button-box-selected"
      );
      let alloc = self.get_allocation();
      console.log(alloc.x, alloc.y);
      console.log("click");
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
      popup_window = NierSelectMenu({
        coord_x: alloc.x + alloc.width + popup_x_offset,
        coord_y: alloc.y,
        button: self,
        current,
        options,
      });
    },
    children: [
      Label({
        className: ["nier-option-item"],
        halign: "end",
        binds: [["label", current, "value"]],
      }),
    ],
    ...props,
  });

export const NierSelectMenu = ({
  coord_x = 0,
  coord_y = 0,
  size = 35,
  spacing = 20,
  button = null,
  current,
  options,
}) =>
  Window({
    exclusive: false,
    focusable: true,
    layer: "overlay",
    anchor: ["top", "left"],
    // popup: true,
    setup: (self) => {
      self.connect("destroy", async (self) => {
        button.child.className = arrremove(
          button.child.className,
          "nier-button-box-selected"
        );
        button.child.className = arradd(
          button.child.className,
          "nier-button-box-hover-from-selected"
        );
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
        button.child.className = arrremove(
          button.child.className,
          "nier-button-box-hover-from-selected"
        );
      });
      self.connect("key-press-event", (widget, event) => {
        if (event.get_keyval()[1] == Gdk.KEY_Escape) {
          self.destroy();
        }
      });
    },
    child: Box({
      vertical: true,
      className: ["nier-option-menu"],
      connections: [
        [
          options,
          (self) => {
            self.children = [
              Box({
                children: [
                  Box({
                    spacing,
                    children: [
                      Box({
                        className: ["nier-option-header"],
                        child: Box({
                          className: ["nier-option-header-inner"],
                        }),
                      }),
                      Icon({
                        icon: App.configDir + "/assets/nier-pointer-rev.svg",
                        size: size,
                        style: "opacity: 0;",
                        className: ["nier-button-hover-icon"],
                      }),
                    ],
                  }),
                ],
              }),

              ...Array.from(options.value, (option) => {
                return NierOptionItem({
                  label: option,
                  size,
                  spacing,
                  button,
                  current,
                });
              }),
            ];
          },
        ],
      ],
      style: `margin-left: ${coord_x}px; margin-top: ${coord_y}px;`,
    }),
  });

export const NierOptionItem = ({
  label = "",
  size = 35,
  spacing = 20,
  button,
  current,
}) =>
  Box({
    className: ["nier-button-container", "nier-option-container"],
    spacing,
    setup: (self) => {
      let label = button.child.centerWidget.children[1];
      if (self.children[0].child.children[0].label == label.label) {
        self.className = arradd(self.className, "nier-option-selected");
      } else {
        self.className = arrremove(self.className, "nier-option-selected");
      }
    },
    children: [
      EventBox({
        onHover: async (self) => {
          let button = self.child;
          let cursor = self.parent.children[1];
          let container = self.parent;

          button.className = arradd(button.className, "nier-button-hover");
          cursor.className = [
            "nier-long-button-hover-icon",
            "nier-long-button-hover-icon-visible",
          ];
          container.className = arradd(
            container.className,
            "nier-button-container-hover"
          );
          return true;
        },
        onPrimaryClick: async (self) => {
          current.setValue(label);
          self.parent.parent.parent.destroy();
          return true;
        },
        onHoverLost: async (self) => {
          let button = self.child;
          let cursor = self.parent.children[1];
          let container = self.parent;

          button.className = arrremove(button.className, "nier-button-hover");
          cursor.className = [
            "nier-long-button-hover-icon",
            "nier-long-button-hover-icon-hidden",
          ];
          container.className = arrremove(
            container.className,
            "nier-button-container-hover"
          );

          return true;
        },
        child: Box({
          className: ["nier-button"],
          children: [Label({ label })],
        }),
      }),
      Icon({
        icon: App.configDir + "/assets/nier-pointer-rev.svg",
        size: size,
        className: ["nier-button-hover-icon", "nier-button-hover-icon-hidden"],
      }),
    ],
  });
