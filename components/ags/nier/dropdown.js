import { Widget, App } from "../imports.js";
import { arradd, arrremove } from "../util.js";
import { NierButton, NierButtonGroup } from "./buttons.js";
const { Gdk } = imports.gi;
const {
  Window,
  Button,
  Label,
  Overlay,
  EventBox,
  Box,
  Scrollable,
  Icon,
  CenterBox,
} = Widget;

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
  dropdowns = {},
  size = 35,
  current = "test",
  popup_window = null,
  in_focus = false,
  popup_in_focus = false,
  ...props
}) =>
  NierButton({
    label,
    className,
    containerClassName,
    containerConnections,
    passedOnHoverLost: async (self) => {
      console.log("hover lost");
      self.child.className = arrremove(
        self.child.className,
        "nier-button-box-hover-from-selected"
      );
      return true;
    },
    // passedOnHover: async (self) => {
    //   self.in_focus = true;
    //   return true;
    // },
    // overlays: [NierOptionMenu({})],
    handleClick: async (self, event) => {
      self.child.className = arradd(
        self.child.className,
        "nier-button-box-selected"
      );
      let alloc = self.get_allocation();
      console.log(alloc.x, alloc.y);
      console.log("click");
      popup_window = NierSelectMenu({
        coord_x: alloc.x + alloc.width + 20,
        coord_y: alloc.y,
        parent: self,
      });
      // await new Promise((resolve) => {
      //   setTimeout(resolve, 5000);
      // });
      // popup_window.destroy();
    },
    children: [
      Label({
        label: current,
      }),
    ],
  });

// export const NierOptionMenu = ({ coord_x = 0, coord_y = 0, options = [] }) =>
//   Box({
//     className: ["nier-option-menu"],
//     // child: NierButton({ label: "test" }),
//     style: `margin-left: ${coord_x}px; margin-top: ${coord_y}px;`,
//   });

export const NierSelectMenu = ({
  coord_x = 0,
  coord_y = 0,
  parent = null,
  options = [],
}) =>
  Window({
    exclusive: false,
    focusable: true,
    layer: "overlay",
    anchor: ["top", "left"],
    // popup: true,
    setup: (self) => {
      self.connect("destroy", async (self) => {
        console.log("destroyying");
        parent.child.className = arrremove(
          parent.child.className,
          "nier-button-box-selected"
        );
        parent.child.className = arradd(
          parent.child.className,
          "nier-button-box-hover-from-selected"
        );
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
        parent.child.className = arrremove(
          parent.child.className,
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
      className: ["nier-option-menu"],
      child: NierButtonGroup({
        // passedOnHover: async (self) => {
        //   parent.popup_in_focus = true;
        //   return true;
        // },
        // passedOnHoverLost: async (self) => {
        //   parent.popup_in_focus = false;
        //   if (!self.in_focus) {
        //     if (parent.popup_window) {
        //       parent.popup_window.destroy();
        //       parent.popup_window = null;
        //     }
        //   }
        //   return true;
        // },
        buttons: [],
      }),
      style: `margin-left: ${coord_x}px; margin-top: ${coord_y}px;`,
    }),
  });

export const NierOptionItem = ({ label = "", ...props }) =>
  NierButton({
    label,
    className: ["nier-option-item"],
    ...props,
  });
