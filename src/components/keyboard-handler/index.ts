import { PolymerElement } from '@polymer/polymer/polymer-element';
import { customElement } from '@polymer/decorators';

export enum Action {
  CONFIRM = 'confirm',
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT = 'left',
  MENU = 'menu',
  SELECT = 'select',
  CANCEL = 'cancel',
}

const defaultKeymap: {[code: string]: Action} = {
  Space: Action.CONFIRM,
  Enter: Action.CONFIRM,
  KeyW: Action.UP,
  KeyD: Action.RIGHT,
  KeyS: Action.DOWN,
  KeyA: Action.LEFT,
  ArrowUp: Action.UP,
  ArrowRight: Action.RIGHT,
  ArrowDown: Action.DOWN,
  ArrowLeft: Action.LEFT,
  Backspace: Action.MENU,
  Backquote: Action.MENU,
  ShiftLeft: Action.SELECT,
  ShiftRight: Action.SELECT,
  Escape: Action.CANCEL,
};


@customElement('keyboard-handler')
export class KeyboardHandler extends PolymerElement {
  private keyboardMap_ = new Map<Action, [string, string]>();
  private keysDown_ = new Set<string>();

  /**
   * Initialize keyboard handler with default keymap
   */
  constructor() {
    super();
    this.resetKeymap();
  }

  /**
   * Create event listeners on document.body for keyboard handling. When a key
   * is first pressed down, the key-down event will fire. (This will not repeat
   * while the key is held down.) When a key is released, the key-up event will
   * fire.
   */
  ready() {
    super.ready();

    document.body.addEventListener('keydown', (kbd: KeyboardEvent) => {
      this.keyboardMap_.forEach((value, key) => {
        if (value.indexOf(kbd.code) >= 0 && !this.keysDown_.has(kbd.code)) {
          this.keysDown_.add(kbd.code);
          this.dispatchEvent(new CustomEvent('key-down', {
            bubbles: true,
            composed: true,
            detail: {
              down: true,
              action: key,
            },
          }));
        }
      });
    });
    document.body.addEventListener('keyup', (kbd: KeyboardEvent) => {
      this.keyboardMap_.forEach((value, key) => {
        if (value.indexOf(kbd.code) >= 0) {
          this.keysDown_.delete(kbd.code);
          this.dispatchEvent(new CustomEvent('key-up', {
            bubbles: true,
            composed: true,
            detail: {
              down: false,
              action: key,
            },
          }));
        }
      });
    });
  }

  /**
   * Change an action's keymapping. Any given action may have two keys mapped to
   * it.
   * @param action the action to map
   * @param code1 the first key to map to the action
   * @param code2 the second key to map to the action
   */
  setKeyMapping(action: Action, code1: string, code2: string) {
    this.keyboardMap_.set(action, [code1, code2]);
  }

  /**
   * Resets keymapping to default values
   */
  resetKeymap() {
    const actionCodeMap = Object.keys(defaultKeymap).reduce((obj, key) => {
      if (obj[defaultKeymap[key]]) {
        obj[defaultKeymap[key]][1] = key;
      } else {
        obj[defaultKeymap[key]] = [key, ''];
      }
      return obj;
    }, {} as {[key: string]: [string, string]});
    for (const action in actionCodeMap) {
      this.keyboardMap_.set(action as Action, actionCodeMap[action]);
    }
  }
}
