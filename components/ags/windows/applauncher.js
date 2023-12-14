// importing
import {
  Hyprland,
  Notifications,
  Audio,
  Battery,
  SystemTray,
  App,
  Widget,
  Utils,
  Mpris,
  Variable,
} from "../imports.js";
import { NierButton, NierButtonGroup } from "../nier/buttons.js";

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  arradd,
  arrremove,
  themedir,
} from "../util.js";

const { Box, Label, Button, EventBox, Revealer, Scrollable, Icon } = Widget;
const { execAsync } = Utils;
const { GdkPixbuf, Pango } = imports.gi;

const Gio = imports.gi.Gio;

function searchAppInfo(searchString) {
  // Get all applications of type 'Application'
  const appInfos = Gio.AppInfo.get_all("Application");
  console.log("applications :: ", appInfos);

  // Filter the appInfos based on the search string
  const filteredAppInfos = appInfos.filter((appInfo) => {
    // Match the search string against the application name or description
    const name = appInfo.get_display_name().toLowerCase();
    const description = appInfo.get_description()?.toLowerCase();
    const searchTerm = searchString.toLowerCase();
    return name.includes(searchTerm) || description?.includes(searchTerm);
  });

  return filteredAppInfos;
}

// const appSys =
//   Gio.DesktopAppInfo.new_from_filename("dummy.desktop").get_app_info();

export const AppLauncher = (allApps = Variable(Gio.app_info_get_all(), {})) =>
  Box({
    vertical: true,
    classNames: ["app-launcher"],
    children: [
      Widget.Entry({
        classNames: ["app-launcher-search"],
        placeholderText: "search apps",
        text: "",
        visibility: true, // set to false for passwords
        onChange: ({ text }) => {
          console.log("text changed :: ", text);
          allApps.setValue(searchAppInfo(text));
        },
        onAccept: ({ text }) => {
          console.log("text accepted :: ", text);
          allApps.value[0].launch([], null);
        },
      }),
      Scrollable({
        vscroll: "always",
        hscroll: "never",
        vexpand: true,
        hexpand: true,
        hpack: "fill",
        vpack: "fill",
        classNames: ["app-launcher-scroll"],

        child: Box({
          vertical: true,
          children: [
            NierButtonGroup({
              connections: [
                [
                  allApps,
                  (self) => {
                    console.log("allApps changed :: ", allApps.value);
                    let buttons = self.children[1];
                    buttons.children = allApps.value.map((app) => {
                      return NierButton({
                        font_size: 25,
                        //   icon: app.get_icon().to_string(),
                        label: app.get_display_name(),
                        labelOveride: (label, font_size, max_label_chars) =>
                          Box({
                            children: [
                              // Icon({
                              //   classNames: ["app-launcher-icon"],
                              //   size: 20,
                              //   icon: app.get_icon()?.to_string(),
                              // }),
                              Label({
                                classNames: ["app-launcher-label"],
                                css: `font-size: ${font_size}px;`,
                                wrap: true,
                                label: label,
                                setup: (self) =>
                                  Utils.timeout(1, () => {
                                    self.set_ellipsize(Pango.EllipsizeMode.END);
                                    self.set_line_wrap(true);
                                  }),
                              }),
                            ],
                          }),
                        handleClick: async (button, event) => {
                          app.launch([], null);
                          button.classNames = arradd(
                            button.classNames,
                            "nier-button-box-selected"
                          );
                          await new Promise((resolve) => {
                            setTimeout(resolve, 500);
                          });
                          button.classNames = arrremove(
                            button.classNames,
                            "nier-button-box-selected"
                          );
                          button.classNames = arradd(
                            button.classNames,
                            "nier-button-box-hover-from-selected"
                          );
                          await new Promise((resolve) => {
                            setTimeout(resolve, 500);
                          });
                          button.classNames = arrremove(
                            button.classNames,
                            "nier-button-box-hover-from-selected"
                          );
                        },
                        //   handleClick: async (self, event) => {},
                      });
                    });
                  },
                ],
              ],
              setup: (self) =>
                Utils.timeout(1, () => {
                  let buttons = self.children[1];
                  buttons.children = allApps.value.map((app) => {
                    return NierButton({
                      font_size: 40,
                      //   icon: app.get_icon().to_string(),
                      label: app.get_display_name(),
                      labelOveride: (label, font_size, max_label_chars) =>
                        Box({
                          children: [
                            // Icon({
                            //   classNames: ["app-launcher-icon"],
                            //   size: 20,
                            //   icon: app.get_icon()?.to_string(),
                            // }),
                            Label({
                              classNames: ["app-launcher-label"],
                              wrap: true,
                              label: label,
                              setup: (self) =>
                                Utils.timeout(1, () => {
                                  self.set_ellipsize(Pango.EllipsizeMode.END);
                                  self.set_line_wrap(true);
                                }),
                            }),
                          ],
                        }),
                      handleClick: async (button, event) => {
                        app.launch([], null);
                        button.classNames = arradd(
                          button.classNames,
                          "nier-button-box-selected"
                        );
                        await new Promise((resolve) => {
                          setTimeout(resolve, 500);
                        });
                        button.classNames = arrremove(
                          button.classNames,
                          "nier-button-box-selected"
                        );
                        button.classNames = arradd(
                          button.classNames,
                          "nier-button-box-hover-from-selected"
                        );
                        await new Promise((resolve) => {
                          setTimeout(resolve, 500);
                        });
                        button.classNames = arrremove(
                          button.classNames,
                          "nier-button-box-hover-from-selected"
                        );
                      },
                      //   handleClick: async (self, event) => {},
                    });
                  });
                }),
            }),
          ],
        }),
      }),
    ],
  });
