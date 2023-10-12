import Service from 'resource:///com/github/Aylur/ags/service/service.js';

class PillThing extends Service {
    static {
        Service.register(
            this,
            {
                'now-playing-changed': ['string'],
            },
            {
                // 'name-of-signal': [type as a string from GObject.TYPE_<type>],
                'now-playing': ['string','rw'],
                
            },
        );
    }
    _now_playing = ""

    get now_playing() {return this._now_playing}

    set now_playing(value) {
        this._now_playing = value
        this.emit('now-playing-changed', value);
        console.log(`now playing changed: ${this._now_playing}`)
    }

    constructor() {
        super();
        this._now_playing = ""
    }

    connectWidget(widget, callback, event = 'now-playing-changed') {
        super.connectWidget(widget, callback, event);
    }

}

// the singleton instance
const service = new PillThing();

// make it global for easy use with cli
globalThis.now_playing = service;

// export to use in other modules
export default service;
