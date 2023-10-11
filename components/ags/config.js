// importing 
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec, execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

// widgets can be only assigned as a child in one container
// so to make a reuseable widget, just make it a function
// then you can use it by calling simply calling it


const Workspaces = () => Widget.Box({
    className: 'workspaces',
    children: [
        Widget.Button({
                child:Widget.Label({label:"1"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"2"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"3"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"4"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"5"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"6"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"7"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"8"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"9"}),
                className: ["workspace"]
            }),
        Widget.Button({
                child:Widget.Label({label:"10"}),
                className: ["workspace"]
            }),
    ],
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
    ]]
});

const ClientTitle = () => Widget.Label({
    className: 'client-title',
    binds: [
        ['label', Hyprland.active.client, 'title'],
    ],
});

const Clock = () => Widget.Label({
    className: 'clock',
    connections: [
        // this is what you should do
        [1000, self => execAsync(['date', '+%H:%M'])
            .then(date => self.label = date).catch(console.error)],
    ],
});

// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
const Notification = () => Widget.Box({
    className: 'notification',
    children: [
        Widget.Icon({
            icon: 'preferences-system-notifications-symbolic',
            connections: [
                [Notifications, self => self.visible = Notifications.popups.length > 0],
            ],
        }),
        Widget.Label({
            connections: [[Notifications, self => {
                self.label = Notifications.popups[0]?.summary || '';
            }]],
        }),
    ],
});

const Media = () => Widget.Button({
    className: 'media',
    onPrimaryClick: () => Mpris.getPlayer('')?.playPause(),
    onScrollUp: () => Mpris.getPlayer('')?.next(),
    onScrollDown: () => Mpris.getPlayer('')?.previous(),
    child: Widget.Label({
        connections: [[Mpris, self => {
            const mpris = Mpris.getPlayer('');
            // mpris player can be undefined
            let txt = `${mpris.trackArtists.join(', ')} - ${mpris.trackTitle}`;
            if (mpris){
                self.label = txt;
            } else {
                self.label = '';
            }
        }]],
    }),
    connections: [[Mpris, self => {
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
    }]]
});

const Volume = () => Widget.Box({
    className: 'volume',
    style: 'min-width: 180px',
    children: [
        Widget.Stack({
            items: [
                // tuples of [string, Widget]
                ['101', Widget.Icon('audio-volume-overamplified-symbolic')],
                ['67', Widget.Icon('audio-volume-high-symbolic')],
                ['34', Widget.Icon('audio-volume-medium-symbolic')],
                ['1', Widget.Icon('audio-volume-low-symbolic')],
                ['0', Widget.Icon('audio-volume-muted-symbolic')],
            ],
            connections: [[Audio, self => {
                if (!Audio.speaker)
                    return;

                if (Audio.speaker.isMuted) {
                    self.shown = '0';
                    return;
                }

                const show = [101, 67, 34, 1, 0].find(
                    threshold => threshold <= Audio.speaker.volume * 100);

                self.shown = `${show}`;
            }, 'speaker-changed']],
        }),
        Widget.Slider({
            hexpand: true,
            drawValue: false,
            onChange: ({ value }) => Audio.speaker.volume = value,
            connections: [[Audio, self => {
                self.value = Audio.speaker?.volume || 0;
            }, 'speaker-changed']],
        }),
    ],
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
        ClientTitle(),
    ],
});

const Center = () => Widget.Box({
    children: [
        Media(),
        Notification(),
    ],
});

const Right = () => Widget.Box({
    halign: 'end',
    children: [
        //Volume(),
        //BatteryLabel(),
        Clock(),
        //SysTray(),
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