// importing 
import { Hyprland, Notifications, Mpris, Audio, Battery, SystemTray, App, Widget, Utils, Variable} from './imports.js';
// import Notifications from './imports.js';
// import Mpris from './imports.js';
// import Audio from './imports.js';
// import Battery from './imports.js';
// import SystemTray from './imports.js';
// import App from './imports.js';
// import Widget from './imports.js';
// import { Utils } from './imports.js';
import nowplaying  from './service/nowplaying.js'; //;

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, just make it a function
// then you can use it by calling simply calling it

//get home dir
const home = `/home/${Utils.exec('whoami')}`
const themedir = App.configDir.split('/').slice(0,-2).join('/')
console.log("homedir:: "+ home)
console.log("themedir:: " + themedir)


const battery = Variable(false,{
    poll:[1500,['cat','/sys/class/power_supply/ADP0/online'], out => {
        if (out=="1") {
            return false
        } else if (out=="0") {
            return true
        }
    }]
})

globalThis.battery = battery;

let prev_battery = false
battery.connect('changed', ({ value }) => {
    if (prev_battery == value){
        return
    }
    prev_battery = value
    if (battery.value) {
        App.resetCss();
        App.applyCss(App.configDir +`/style-battery.css`);
    } else {
        App.resetCss();
        App.applyCss(App.configDir +`/style.css`);
    }
});

function get_color(){
    return Utils.readFileAsync(home + '/.config/hypr/themes/uicolors')
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

Utils.subprocess([
    'inotifywait',
    '--recursive',
    '--event', 'create,modify',
    '-m', home + '/.config/hypr/themes/uicolors',
], () => {
    const colors_path = App.configDir + '/colors.css';
    
    get_color().then( colors => {
        let content = "";
        //loop through colors
        for (const [key, value] of Object.entries(colors)) {
            content += `@define-color c${key} ${value};\n`;
        }

        Utils.writeFile(content, colors_path)
            .then(file => {
                print('colors.css updated');
                App.resetCss();
                if (battery.value) {
                    App.applyCss(App.configDir +`/style-battery.css`);
                } else {
                    App.applyCss(App.configDir +`/style.css`);
                }
            })
            .catch(err => print(err));
    })
});


const Workspaces = () => Widget.Box({
        className: 'workspaces',
        
        children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Button({
            child:Widget.Label({label:`${i}`}),
            className: "workspace",
            onClicked: () => Utils.execAsync(`hyprctl dispatch workspace ${i}`),
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
        [1000, self => Utils.execAsync(['date', '+%I:%M'])
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

let NO = false;

const Media = () => Widget.Button({
        className: 'media',
        onPrimaryClick: () => Mpris.getPlayer('')?.playPause(),
        onScrollUp: async (self) => {
            if (NO){
                return;
            }
            NO = true;
            Mpris.getPlayer('')?.next();
            self.className = ['media','next'];
            await new Promise(r => setTimeout(r, 700));
            NO = false;
        },
        onScrollDown: async (self) => {
            if (NO){
                return;
            }
            NO = true;
            Mpris.getPlayer('')?.previous();
            self.className = ['media','back'];
            await new Promise(r => setTimeout(r, 700));
            NO = false;
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
                                Utils.execAsync([`${themedir}/scripts/pywal_set`, `--reset`])
                                    .then(out => console.log(out))
                                    .catch(err => console.log(err));
                                nowplaying.now_playing = "";
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
                    Utils.execAsync(["cp",player.cover_path,`/tmp/musiccover.png`])
                        .then(async(out) => {
                            await new Promise(r => setTimeout(r, 300));
                            Utils.execAsync([`${themedir}/scripts/cover2bg`, `/tmp/musiccover.png`])
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

const ProgressBar = () => Widget.ProgressBar({
    className: 'progress',
    connections: [
        [100, self => {
            const mpris = Mpris.getPlayer('');
            if (mpris){
                self.fraction = mpris.position/mpris.length;
            }
        }],
        [Mpris, self => {
            const mpris = Mpris.getPlayer('');
            // mpris player can be undefined
            if (mpris){
                if (mpris.playBackStatus === 'Playing') {
                    self.className = ['progress','playing'];
                } else {
                    self.className = ['progress','paused'];
                }
                
            } else {
                self.className = ['progress'];
                self.fraction = 0;
            }
        }]
    ],
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


const BottomBar = ({ monitor } = {}) => Widget.Window({
    name: `bot-bar-${monitor}`, // name has to be unique
    className: 'bot-bar',
    monitor,
    margin: [0, 0],
    anchor: ['bottom', 'left', 'right'],
    exclusive: false,
    child: ProgressBar(),
})

// exporting the config so ags can manage the windows
export default {
    style: App.configDir +`/style.css`,
    windows: [
        Bar(),
        BottomBar()

        // you can call it, for each monitor
        // Bar({ monitor: 0 }),
        // Bar({ monitor: 1 })
    ],
};