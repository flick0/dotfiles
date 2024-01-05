// importing
import {
  Widget,
  Utils,
  Variable,
} from "../../imports.js";
import { NierButton, NierButtonGroup } from "../../nier/buttons.js";

import {
  SCREEN_HEIGHT,
  arradd,
  arrremove,
} from "../../util.js";

const { Box, Label,Scrollable, Icon } = Widget;
const { Pango } = imports.gi;

const Gio = imports.gi.Gio;

function searchAppInfo(searchString) {
  const appInfos = Gio.AppInfo.get_all("Application");
  console.log("applications :: ", appInfos);

  const filteredAppInfos = appInfos.filter((appInfo) => {
    const name = appInfo.get_display_name().toLowerCase();
    const description = appInfo.get_description()?.toLowerCase();
    const searchTerm = searchString.toLowerCase();
    return name.includes(searchTerm) || description?.includes(searchTerm);
  });

  return filteredAppInfos;
}

export const AppLauncher = ({
  allApps = Variable(Gio.app_info_get_all(), {}),
  assetsDir = null
}) =>
  Box({
    vertical: true,
    classNames: ["app-launcher"],
    children: [
      Widget.Entry({
        classNames: ["app-launcher-search"],
        placeholderText: "search apps",
        text: "",
        visibility: true,
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
        hexpand: true,
        hpack: "fill",
        classNames: ["app-launcher-scroll"],
        css: `min-height: ${Math.round(SCREEN_HEIGHT/3)}px;`,

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
                        useAssetsDir: assetsDir,
                        font_size: 25,
                        label: app.get_display_name(),
                        labelOveride: (label, font_size, max_label_chars) =>
                          Box({
                            children: [
                              Icon({
                                classNames: ["app-launcher-icon"],
                                size: 20,
                                icon: app.get_icon()?.to_string(),
                              }),
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
                      useAssetsDir: assetsDir,
                      font_size: 40,
                      label: app.get_display_name(),
                      labelOveride: (label, font_size, max_label_chars) =>
                        Box({
                          children: [
                            Icon({
                              classNames: ["app-launcher-icon"],
                              size: 20,
                              icon: app.get_icon()?.to_string(),
                            }),
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
                    });
                  });
                }),
            }),
          ],
        }),
      }),
    ],
  });
