import { PolymerElement } from '@polymer/polymer/polymer-element';
import { customElement } from '@polymer/decorators';

import { Optional } from '../../util';
import { Action, Service } from '../../options';

const options = Service.getKeybindOptions();

@customElement('keyboard-handler')
export class KeyboardHandler extends PolymerElement {
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
      options.getOptionNames().forEach((name) => {
        const value = options.getOption(name);
        if (!value) return;
        if ((value as string[]).indexOf(kbd.code) >= 0
            && !this.keysDown_.has(kbd.code)) {
          this.keysDown_.add(kbd.code);
          this.dispatchEvent(new CustomEvent('key-down', {
            bubbles: true,
            composed: true,
            detail: {
              down: true,
              action: name,
              srcEvent: kbd,
            },
          }));
        }
      });
    });
    document.body.addEventListener('keyup', (kbd: KeyboardEvent) => {
      options.getOptionNames().forEach((name) => {
        const value = options.getOption(name);
        if (!value) return;
        if ((value as string[]).indexOf(kbd.code) >= 0) {
          this.keysDown_.delete(kbd.code);
          this.dispatchEvent(new CustomEvent('key-up', {
            bubbles: true,
            composed: true,
            detail: {
              down: false,
              action: name,
              srcEvent: kbd,
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
    options.setOption(action, [code1, code2]);
  }

  /**
   * Get the keys mapped to the given action
   * @param action the action to get keys for
   * @returns a string array of length 2 with the key codes bound to the given
   * action
   */
  getKeyMappingForAction(action: Action) {
    return options.getOption(action) as string[];
  }

  /**
   * Get an action for a given key code
   * @param code the key code to search for
   * @returns the action associated with the key code, or undefined if there is
   * no associated action
   */
  getActionForKey(code: string) {
    let foundAction: Optional<Action>;
    const actions = options.getOptionNames();
    actions.forEach((name) => {
      if (foundAction) return;
      const value = options.getOption(name);
      if (!value) return;
      if ((value as string[]).indexOf(code) >= 0) {
        foundAction = name as Action;
      }
    });
    return foundAction;
  }

  /**
   * Resets keymapping to default values
   */
  resetKeymap() {
    options.resetDefaults();
  }
}
