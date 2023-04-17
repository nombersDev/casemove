import EventEmitter from "events";

class MyEmitter extends EventEmitter {}
const emitterAccount = new MyEmitter();

export {emitterAccount}
