export interface Reaction {
  detail: any;
}

type ReactorCallback = (reaction: Reaction) => void;

class ReactorEvent {
  private callbacks_: ReactorCallback[] = [];

  addCallback(callback: ReactorCallback) {
    this.callbacks_.push(callback);
  }

  removeCallback(callback: ReactorCallback) {
    this.callbacks_ = this.callbacks_.filter((cb) => cb !== callback);
  }

  runCallbacks(args: Reaction) {
    this.callbacks_.forEach((cb) => {
      cb(args);
    });
  }
}

interface EventsMap {
  [name: string]: ReactorEvent;
}

export class Reactor {
  private events_: EventsMap = {};

  static get instance() { return this.instance_; }

  private static instance_ = new Reactor();

  private constructor() {}

  addEventListener(name: string, callback: ReactorCallback) {
    this.events_[name].addCallback(callback);
  }

  dispatchEvent(name: string, args: Reaction) {
    this.events_[name].runCallbacks(args);
  }

  registerEventType(name: string) {
    const evt = new ReactorEvent();
    this.events_[name] = evt;
  }

  removeEventListener(callback: ReactorCallback) {
    this.events_[name].removeCallback(callback);
  }
}
