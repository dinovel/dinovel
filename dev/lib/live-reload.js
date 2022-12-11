// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class EventHandler {
    #socket;
    #open = false;
    #logEvents;
    #listners = new Map();
    #timeout = new Map();
    #broadcast = new BroadcastChannel('dinovel_dev');
    constructor(socket, logEvents = true){
        this.#socket = socket;
        this.#logEvents = logEvents;
    }
    listen(event, handler) {
        if (!this.#listners.has(event)) {
            this.#listners.set(event, []);
        }
        this.#listners.get(event)?.push(handler);
    }
    listAll(handler) {
        this.listen('*', handler);
    }
    start() {
        if (this.#open) return;
        this.#open = true;
        this.#socket.listen((message)=>this.#handle(message));
        this.#socket.start();
    }
    #handle(message) {
        const data = this.#parse(message);
        if (!data) return;
        this.#clearTimout(data.type);
        this.#log('log', 'Received event', data);
        setTimeout(()=>{
            this.#listners.get('*')?.forEach((h)=>h(data));
            this.#listners.get(data.type)?.forEach((h)=>h(data));
            this.#broadcast.postMessage(data);
        }, 300);
    }
    #parse(message1) {
        try {
            return JSON.parse(message1);
        } catch (e) {
            this.#log('error', 'Failed to parse message', e);
            return undefined;
        }
    }
    #log(type, ...args) {
        if (this.#logEvents) {
            console[type](...args);
        }
    }
    #clearTimout(event) {
        const timeout = this.#timeout.get(event);
        if (timeout) {
            clearTimeout(timeout);
            this.#timeout.delete(event);
        }
    }
}
class PersistentWebSocket {
    #toSend = [];
    #toHandle = [];
    #handlers = [];
    #url;
    #ws;
    #logEvents;
    #ready = false;
    #interval;
    constructor(url, interval = 1000, log = true){
        this.#url = url;
        this.#logEvents = log;
        this.#interval = interval;
    }
    listen(handler) {
        this.#handlers.push(handler);
        this.#toHandle.forEach(handler);
        this.#toHandle = [];
    }
    send(message) {
        if (this.#ready && this.#ws) {
            this.#log('log', 'Sending message', message);
            this.#ws.send(message);
        } else {
            this.#log('warn', 'Queueing message', message);
            this.#toSend.push(message);
        }
    }
    start() {
        this.#init();
    }
    #init() {
        try {
            const wsURL = window.location.origin.replace(/^http/, 'ws') + this.#url;
            console.debug('Connecting to persistent socket', wsURL);
            this.#ws = new WebSocket(wsURL);
            this.#ws.onopen = ()=>{
                this.#log('log', 'Connected to persistent socket');
                this.#ready = true;
                this.#toSend.forEach((m)=>this.send(m));
                this.#toSend = [];
            };
            this.#ws.onmessage = (e)=>this.#receive(e.data);
            this.#ws.onerror = (e)=>{
                this.#log('error', 'Persistent socket error', e);
                this.#restart();
            };
            this.#ws.onclose = ()=>{
                this.#log('warn', 'Persistent socket closed');
                this.#restart();
            };
        } catch (e1) {
            this.#log('error', 'Failed to initialize websocket', e1);
            this.#restart();
        }
    }
    #restart() {
        this.#ready = false;
        this.#ws?.close();
        setTimeout(()=>{
            this.#log('log', 'Restarting persistent socket');
            this.#init();
        }, this.#interval);
    }
    #receive(message2) {
        try {
            this.#log('log', 'Received message', message2);
            if (this.#handlers.length) {
                this.#handlers.forEach((h)=>h(message2));
            } else {
                this.#toHandle.push(message2);
            }
        } catch (e11) {
            this.#log('error', 'Failed to parse message', message2, e11);
        }
    }
    #log(type1, ...args1) {
        if (this.#logEvents) {
            console[type1](...args1);
        }
    }
}
class LiveReload {
    #eventHandler;
    constructor(options){
        console.debug(options);
        this.#eventHandler = new EventHandler(new PersistentWebSocket(options.endpoint, 1000, options.enableLogging), options.enableLogging);
        this.#eventHandler.listen(options.reloadEvent, ()=>{
            this.#reload();
        });
    }
    start() {
        this.#eventHandler.start();
    }
    #reload() {
        window.location.reload();
    }
}
const DEFAULT_ENDPOINT = '/__livereload';
function buildLiveReloadOptions(opt) {
    return {
        endpoint: DEFAULT_ENDPOINT,
        reloadEvent: 'reload',
        enableLogging: true,
        ...opt
    };
}
export { DEFAULT_ENDPOINT as DEFAULT_ENDPOINT };
export { buildLiveReloadOptions as buildLiveReloadOptions };
export { LiveReload as LiveReload };
