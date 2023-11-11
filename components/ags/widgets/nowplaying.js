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

const { Box, Label, Button, EventBox, Revealer } = Widget;
const { execAsync } = Utils;
const { GdkPixbuf, Pango } = imports.gi;

const opacity_map = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

const image_to_matrix = async (inputPath, imagedat, threshold = 128) => {
  // Load the image from file
  const resizedPixbuf = GdkPixbuf.Pixbuf.new_from_file(inputPath);

  // Get pixel data
  const pixels = resizedPixbuf.get_pixels();
  const rowstride = resizedPixbuf.get_rowstride();
  const channels = resizedPixbuf.get_n_channels();

  let max = 0;
  const darknessMatrix = [];
  // Loop through each pixel and calculate lightness
  for (let y = 0; y < resizedPixbuf.get_height(); y++) {
    let row = [];
    for (let x = 0; x < resizedPixbuf.get_width(); x++) {
      const index = y * rowstride + x * channels;
      const [r, g, b] = pixels.slice(index, index + channels);

      // Calculate lightness based on the pixel's intensity (grayscale)
      const intensity = Math.round(0.3 * r + 0.59 * g + 0.11 * b);
      const darkness = intensity / 255.0; // Normalize to the range [0, 1]
      if (darkness > max) {
        max = darkness;
      }
      row.push(darkness);
    }
    darknessMatrix.push(row);
  }

  for (let y = 0; y < resizedPixbuf.get_height(); y++) {
    for (let x = 0; x < resizedPixbuf.get_width(); x++) {
      darknessMatrix[y][x] = darknessMatrix[y][x] + (1 - max);
    }
  }
  imagedat.value = darknessMatrix;
  // imagedat.emit("changed");

  // You can further process or save the lightnessMatrix as needed
};

export const NowPlaying = ({
  rows = 64,
  imagedat = Variable(
    Array.from({ length: rows }, (_, i) =>
      Array.from({ length: rows }, (_, i) => 1)
    ),
    {}
  ),
  cell_width = 15,
  cell_height = 15,
  preparing_cover = false,
}) =>
  Box({
    vertical: true,
    className: ["nowplaying-container"],
    children: [
      Box({
        style: `min-width: ${rows * cell_width + 30 + 30 - 20}px;`,
        halign: "end",
        children: [
          Button({
            halign: "end",
            className: ["player-buttons"],
            hexpand: true,
            child: Label({
              label: "⏮",
              className: ["heading"],
            }),
            onClicked: async (self) => {
              const player = Mpris.players[0];
              player.previous();
              self.className = arradd(self.className, "pressed");
              await new Promise((r) => setTimeout(r, 100));
              self.className = arrremove(self.className, "pressed");
            },
          }),
          Button({
            halign: "end",
            className: ["player-buttons"],
            // hexpand: true,
            child: Label({
              label: "⏸",
              className: ["heading"],
            }),
            onClicked: async (self) => {
              const player = Mpris.players[0];
              player.playPause();

              self.className = arradd(self.className, "pressed");
              console.log(self.className);
              await new Promise((r) => setTimeout(r, 100));
              self.className = arrremove(self.className, "pressed");
              console.log(self.className);
            },
          }),
          Button({
            halign: "end",
            className: ["player-buttons"],
            style: "margin-right: 15px;",
            // hexpand: true,
            child: Label({
              label: "⏭",
              className: ["heading"],
            }),
            onClicked: async (self) => {
              const player = Mpris.players[0];
              player.next();
              self.className = arradd(self.className, "pressed");
              await new Promise((r) => setTimeout(r, 100));
              self.className = arrremove(self.className, "pressed");
            },
          }),
        ],
      }),
      Box({
        className: ["image-matrix-container"],
        halign: "center",
        children: [
          Box({
            className: "image-matrix-col",
            vertical: true,
            children: [
              ...Array.from({ length: rows }, (_, i) =>
                EventBox({
                  child: Box({
                    className: ["image-matrix-row", `image-matrix-row-${i}`],
                    children: [
                      ...Array.from({ length: rows }, (_, j) =>
                        Box({
                          className: [
                            "image-matrix-cell",
                            `image-matrix-cell-${i}-${j}`,
                          ],

                          style: `min-width: ${cell_width}px; min-height: ${cell_height}px;`,
                        })
                      ),
                    ],
                  }),
                  setup: (self) => {
                    //hover
                    self.connect("enter-notify-event", () => {
                      self.child.className = arrremove(
                        self.child.className,
                        "nohover"
                      );
                      self.child.className = arradd(
                        self.child.className,
                        "hover"
                      );
                    });
                    self.connect("leave-notify-event", () => {
                      self.child.className = arrremove(
                        self.child.className,
                        "hover"
                      );
                      self.child.className = arradd(
                        self.child.className,
                        "nohover"
                      );
                    });
                  },
                })
              ),
            ],
            connections: [
              [
                imagedat,
                (self) => {
                  if (preparing_cover) {
                    return;
                  }
                  console.log("got matrix update");
                  for (let y = 0; y < imagedat.value.length; y++) {
                    for (let x = 0; x < imagedat.value[y].length; x++) {
                      let cell = self.children[y].child.children[x];
                      if (!cell) {
                        continue;
                      }
                      let opacity =
                        opacity_map[
                          Math.round(
                            (1 - imagedat.value[y][x]) *
                              (opacity_map.length - 1)
                          )
                        ];
                      for (let op of opacity_map) {
                        cell.className = arrremove(
                          cell.className,
                          `shade-${Math.round(op * 10)}`
                        );
                      }
                      cell.className = arradd(
                        cell.className,
                        `shade-${Math.round(opacity * 10)}`
                      );
                    }
                  }
                  console.log("relocking cover");
                },
                "changed",
              ],
              [
                Mpris,
                (self) => {
                  const player = Mpris.players[0];
                  if (preparing_cover) {
                    console.log("skipping mpris");
                    return;
                  }
                  console.log("preparing cover");
                  preparing_cover = true;
                  execAsync(["cp", player.cover_path, "/tmp/to_bg.png"])
                    .then((out) => {
                      execAsync([
                        themedir + "/scripts/prepare_cover.sh",
                        player.cover_path,
                        `${rows}`,
                      ])
                        .then((out) => {
                          console.log("cover prepared");
                          Promise.resolve(
                            image_to_matrix("/tmp/bg.png", imagedat, rows)
                          ).then(() => {
                            preparing_cover = false;
                            imagedat.emit("changed");
                          });
                        })
                        .catch((e) => {
                          preparing_cover = false;
                          console.log(e);
                        });
                    })
                    .catch((e) => {
                      preparing_cover = false;
                      console.log(e);
                    });
                },
              ],
            ],
          }),
        ],
      }),
      Box({
        className: ["nowplaying-info-container"],
        children: [
          Revealer({
            revealChild: false,
            transitionDuration: 1000,
            child: Label({
              label: "woa",
              className: "heading",
              style: `min-width: ${rows * cell_width + 15 + 15 - 20}px;`,
              halign: "start",
              xalign: 0,
              wrap: true,
              max_width_chars: 20,
              setup: (self) => {
                self.set_line_wrap_mode(Pango.WrapMode.WORD_CHAR);
                self.set_ellipsize(Pango.EllipsizeMode.END);
              },
            }),
            transition: "slide_left",
            connections: [
              [
                Mpris,
                async (self) => {
                  const player = Mpris.players[0];
                  if (player.track_title !== self.child.label) {
                    let cursor = self.parent.children[1];
                    await new Promise((r) => setTimeout(r, 1500));
                    cursor.className = arrremove(cursor.className, "hidden");
                    await new Promise((r) => setTimeout(r, 1500));
                    self.revealChild = false;
                    await new Promise((r) => setTimeout(r, 1500));
                    self.child.label = player.track_title;
                    self.revealChild = true;
                    await new Promise((r) => setTimeout(r, 1500));
                    cursor.className = arradd(cursor.className, "hidden");
                  }
                },
              ],
            ],
          }),
          Box({
            className: ["nowplaying-info-cursor"],
          }),
        ],
      }),
    ],
    connections: [],
  });
