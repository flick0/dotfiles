// importing 
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec, execAsync, readFileAsync, writeFile, subprocess } from 'resource:///com/github/Aylur/ags/utils.js';
import nowplaying from './service/nowplaying.js';

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, just make it a function
// then you can use it by calling simply calling it

//get home dir
const home = `/home/${exec('whoami')}`
const themedir = App.configDir.split('/').slice(0,-2).join('/')
console.log("homedir:: "+ home)
console.log("themedir:: " + themedir)

function get_color(){
    return readFileAsync(home + '/.config/hypr/themes/colors')
        .then(content => {
            var colors = {}
            //split into lines
            let lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let [key, value] = lines[i].split(':');
                if (key == undefined || value == undefined){
                    continue;
                }
                //strip
                key = key.trim();
                value = value.trim();

                colors[key] = value;
            }
            console.log(colors)
            return colors
        })
        .catch(console.error);
    //return colors;
}

subprocess([
    'inotifywait',
    '--recursive',
    '--event', 'create,modify',
    '-m', home + '/.config/hypr/themes/colors',
], () => {
    const colors_path = App.configDir + '/colors.css';
    
    get_color().then( colors => {
        let content = "";
        //loop through colors
        for (const [key, value] of Object.entries(colors)) {
            content += `@define-color c${key} ${value};\n`;
        }

        writeFile(content, colors_path)
            .then(file => {
                print('colors.css updated');
                App.resetCss();
                App.applyCss(App.configDir +`/style.css`);
            })
            .catch(err => print(err));
    })
});


const Workspaces = () => Widget.Box({
        className: 'workspaces',
        
        children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Button({
            child:Widget.Label({label:`${i}`}),
            className: "workspace",
            onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`),
        })
        ),
        connections: [[Hyprland, box => {

            //loop through children
            for (let i = 0; i < box.children.length; i++) {
                //set the label of the child to the name of the workspace
                if(box.children[i].child.label == Hyprland.active.workspace.id){
                    box.children[i].className = ["active","workspace"];
                } else {
                    box.children[i].className = ["workspace"];
                }
            }
        }
        ]]});

const Clock = () => Widget.Label({
    className: 'clock',
    connections: [
        // this is what you should do
        [1000, self => execAsync(['date', '+%I:%M'])
            .then(date => self.label = date).catch(console.error)],
    ],
});

// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
const Notification = () => Widget.Box({
    className: 'notification',
    children: [
        Widget.Label({
            connections: [[Notifications, async (self) => {
                if (Notifications.popups.length === 0) {
                    // so the transition plays nicely when there are no notifications
                    await new Promise(r => setTimeout(r, 200));
                    self.label = '';
                } else {
                    await new Promise(r => setTimeout(r, 200));
                    self.label = Notifications.popups[0]?.summary
                }
            }]],
        }),
    ],
    connections: [[Notifications, self => {
        if (Notifications.popups.length > 0) {
            if (Notifications.popups[0].urgency === 'critical') {
                self.className = ['notification','critical'];
            } else {
                self.className = ['notification','normal'];
            }
        } else {
            self.className = ['notification'];
        }
    }]],
});

const is_it_playing = (self) => {
    const mpris = Mpris.getPlayer('');
            // mpris player can be undefined
            if (mpris){
                if (mpris.playBackStatus === 'Playing') {
                    self.className = ['media','playing'];
                } else {
                    self.className = ['media','paused'];
                }
                
            } else {
                self.className = ['media'];
            }
}

const Media = () => Widget.Button({
        className: 'media',
        onPrimaryClick: () => Mpris.getPlayer('')?.playPause(),
        onScrollUp: (self) => {
            Mpris.getPlayer('')?.next();
            self.className = ['media','next'];
        },
        onScrollDown: (self) => {
            Mpris.getPlayer('')?.previous();
            self.className = ['media','back'];
        },
        child: Widget.Box({
            children: [
                Widget.Label({
                    connections: [
                        [Mpris, async (self) => {
                            const mpris = Mpris.getPlayer('');
                            // mpris player can be undefined
                            if (mpris && `${mpris.trackArtists.join(', ')}|${mpris.trackTitle}`.length > 1){
                                nowplaying.now_playing = `${mpris.trackArtists.join(', ')}|${mpris.trackTitle}`;
                            } else {
                                while (nowplaying.now_playing.length > 0){
                                    nowplaying.now_playing = nowplaying.now_playing.slice(1,-1);
                                    await new Promise(r => setTimeout(r, 50));
                                }
                            }        
                    }],
                    [nowplaying, self => {
                        self.label = nowplaying.now_playing;
                    }]
                ],
                }),
            ]
        }),
        connections: [
            [Mpris,async (self) => {
                is_it_playing(self)

                //cover art
                const player = Mpris.getPlayer('');

                if (player){
                    const cover_path = `${player.trackCoverUrl} `.slice(7,-1);
                    console.log(1,1,cover_path)
                    execAsync(["cp",cover_path,`/tmp/musiccover.png`])
                        .then(out => {
                            execAsync(["python", `${themedir}/scripts/cover2bg.py`, `/tmp/musiccover.png`])
                                .then(out => console.log(out))
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                    
                }
            }],
        ]
});

const Volume = () => Widget.Button({
    className: 'volume',
    onScrollUp: (self) => {
        let speaker = Audio.speaker;
        if (speaker) {
            speaker.volume = Math.min(1, speaker.volume + 0.01);
        }
    },
    onScrollDown: (self) => {
        let speaker = Audio.speaker;
        if (speaker) {
            speaker.volume = Math.min(1, speaker.volume - 0.01);
        }
    }
});

const BatteryLabel = () => Widget.Box({
    className: 'battery',
    children: [
        Widget.Icon({
            connections: [[Battery, self => {
                self.icon = `battery-level-${Math.floor(Battery.percent / 10) * 10}-symbolic`;
            }]],
        }),
        Widget.ProgressBar({
            valign: 'center',
            connections: [[Battery, self => {
                if (Battery.percent < 0)
                    return;

                self.fraction = Battery.percent / 100;
            }]],
        }),
    ],
});

const SysTray = () => Widget.Box({
    connections: [[SystemTray, self => {
        self.children = SystemTray.items.map(item => Widget.Button({
            child: Widget.Icon({ binds: [['icon', item, 'icon']] }),
            className: "trayitem",
            onPrimaryClick: (_, event) => item.activate(event),
            onSecondaryClick: (_, event) => item.openMenu(event),
            binds: [['tooltip-markup', item, 'tooltip-markup']],
        }));
    }]],
});

// layout of the bar
const Left = () => Widget.Box({
    children: [
        Workspaces(),
        // ClientTitle(),
    ],
    className: 'segment',
});

const Center = () => Widget.Box({
    children: [
        Media(),
        Notification(),
    ],
    className: 'segment',
});

const Right = () => Widget.Box({
    halign: 'end',
    children: [
        // Volume(),
        //BatteryLabel(),
        Clock(),
        // ClientTitle()
        //SysTray(),
    ],
    className: 'segment',
});

const Bar = ({ monitor } = {}) => Widget.Window({
    name: `bar-${monitor}`, // name has to be unique
    className: 'bar',
    monitor,
    margin: [0, 20],
    anchor: ['top', 'left', 'right'],
    exclusive: true,
    child: Widget.CenterBox({
        startWidget: Left(),
        centerWidget: Center(),
        endWidget: Right(),
    }),
})

// exporting the config so ags can manage the windows
export default {
    style: App.configDir + '/style.css',
    windows: [
        Bar(),

        // you can call it, for each monitor
        // Bar({ monitor: 0 }),
        // Bar({ monitor: 1 })
    ],
};