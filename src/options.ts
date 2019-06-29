import { Reactor } from './reactor';

const reactor = Reactor.instance;

export enum Action {
  CONFIRM = 'CONFIRM',
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  MENU = 'MENU',
  SELECT = 'SELECT',
  CANCEL = 'CANCEL',
}

type OptionTypes = string | string[] | number | boolean;

interface OptionsMap {
  name: string;
  label: string;
  possibleValues?: OptionTypes[];
  value?: OptionTypes;
}

interface OptionsValue<T> {
  current: T;
  possible?: T[];
  label: string;
}

class Options {
  private options_ = new Map<string, OptionsValue<OptionTypes>>();
  private defaults_: OptionsMap[];

  constructor(options: OptionsMap[]) {
    this.defaults_ = options;
    this.resetDefaults();
  }

  getOption(name: string) {
    const opt = this.getOptionData(name);
    return opt && opt.current;
  }

  getOptionData(name: string) {
    return this.options_.get(name);
  }

  getOptionNames() {
    return [...this.options_.keys()];
  }

  resetDefaults() {
    this.defaults_.forEach((op) => {
      this.setOptions_(op);
      reactor.dispatchEvent('option-reset', {
        detail: {
          name: op.name,
        },
      });
    });
  }

  setOption(name: string, value: OptionTypes) {
    const opt = this.options_.get(name);
    if (!opt) {
      throw new TypeError(`${name} is not a valid option name`);
    }

    if (opt.possible && opt.possible.indexOf(value) < 0) {
      throw new TypeError('invalid option value');
    }

    const previousValue = opt.current;
    opt.current = value;
    this.options_.set(name, opt);

    reactor.dispatchEvent('option-changed', {
      detail: {
        name,
        previousValue,
        newValue: opt.current,
      },
    });
  }

  private setOptions_(map: OptionsMap) {
    if (map.possibleValues && map.possibleValues.length < 2) {
      throw new TypeError('possibleValues must contain at least two values');
    }
    if (!map.value && !map.possibleValues) {
      throw new TypeError(
          'if possibleValues is undefined, value must be defined');
    }

    this.options_.set(map.name, {
      current: map.value ? map.value : map.possibleValues![0],
      possible: map.possibleValues,
      label: map.label,
    });
  }
}

reactor.registerEventType('option-changed');
reactor.registerEventType('option-reset');

class Properties {
  private properties_ = new Map<string, any>();

  deleteProperty(name: string) {
    const val = this.properties_.get(name);
    this.properties_.delete(name);
    reactor.dispatchEvent('property-changed', {
      detail: {
        name,
        previousValue: val,
        deleted: true,
      },
    });
  }

  getProperty(name: string) {
    return this.properties_.get(name);
  }

  getTypedProperty<T>(name: string) {
    const prop = this.properties_.get(name);
    return prop && prop as T;
  }

  setProperty(name: string, value: any) {
    const prev = this.properties_.get(name);
    this.properties_.set(name, value);
    reactor.dispatchEvent('property-changed', {
      detail: {
        name,
        previousValue: prev,
        newValue: value,
      },
    });
  }
}

reactor.registerEventType('property-changed');

export class Service {
  private keybindOptions_: Options;
  private gameOptions_: Options;
  private gameProperties_: Properties;

  private static instance_ = new Service();

  private constructor() {
    this.gameProperties_ = new Properties();
    this.keybindOptions_ = new Options([
      {
        name: Action.CONFIRM,
        label: 'Confirm',
        value: ['Space', 'Enter'],
      },
      {
        name: Action.UP,
        label: 'Up',
        value: ['KeyW', 'ArrowUp'],
      },
      {
        name: Action.RIGHT,
        label: 'Right',
        value: ['KeyD', 'ArrowRight'],
      },
      {
        name: Action.DOWN,
        label: 'Down',
        value: ['KeyS', 'ArrowDown'],
      },
      {
        name: Action.LEFT,
        label: 'Left',
        value: ['KeyA', 'ArrowLeft'],
      },
      {
        name: Action.MENU,
        label: 'Menu',
        value: ['Backspace', 'Backquote'],
      },
      {
        name: Action.SELECT,
        label: 'Select',
        value: ['ShiftLeft', 'ShiftRight'],
      },
      {
        name: Action.CANCEL,
        label: 'Cancel',
        value: ['Escape', ''],
      },
    ]);
    this.gameOptions_ = new Options([
      {
        name: 'textSpeed',
        label: 'Text speed',
        possibleValues: ['Slow', 'Normal', 'Fast'],
        value: 'Normal',
      },
      {
        name: 'battleEffects',
        label: 'Battle effects',
        possibleValues: ['On', 'Off'],
        value: 'On',
      },
      {
        name: 'battleStyle',
        label: 'Battle style',
        possibleValues: ['Switch', 'Set'],
        value: 'Switch',
      },
      {
        name: 'music',
        label: 'Music volume',
        possibleValues: [0, 1, 2, 3, 4, 5],
        value: 3,
      },
      {
        name: 'sfx',
        label: 'Effect volume',
        possibleValues: [0, 1, 2, 3, 4, 5],
        value: 3,
      },
      {
        name: 'cries',
        label: 'Pokemon cries',
        possibleValues: [0, 1, 2, 3, 4, 5],
        value: 3,
      }
    ]);
  }

  static getGameOptions() {
    return this.instance_.gameOptions_;
  }

  static getGameProperties() {
    return this.instance_.gameProperties_;
  }

  static getKeybindOptions() {
    return this.instance_.keybindOptions_;
  }
}
