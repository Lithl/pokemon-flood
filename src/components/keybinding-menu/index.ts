import { html } from '@polymer/polymer/polymer-element';
import { customElement, query, property } from '@polymer/decorators';
import { PaperListboxElement } from '@polymer/paper-listbox';
import { MenuBehavior } from '../../mixins/menu-behavior';
import { FloodScreen } from '../flood-screens';
import { State } from '../flood-app';

import * as template from './template.html';
import { Constructor, assertUnreachable } from '../../util';
import { Service, Action } from '../../options';

import './index.scss?name=keybinding-menu';

interface ActionBinding {
  value: Action;
  name: string;
  binding1: string;
  binding2: string;
}

enum ActionOptions {
  ACTION_CONFIRM = 0,
  ACTION_UP = 1,
  ACTION_RIGHT = 2,
  ACTION_DOWN = 3,
  ACTION_LEFT = 4,
  ACTION_MENU = 5,
  ACTION_SELECT = 6,
  ACTION_CANCEL = 7,
  CONFIRM = 8,
}

const properties = Service.getGameProperties();
const options = Service.getKeybindOptions();

@customElement('keybinding-menu')
export class KeybindingMenu extends  MenuBehavior
    (FloodScreen as unknown as Constructor<FloodScreen>) {
  @query('#menuOptions') private menuOptions_!: PaperListboxElement;
  @property() private actions_: ActionBinding[] = [];
  @property() private currentlyBindingIdx_?: number;
  private trapKeyup_ = false;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  constructor() {
    super(options.getOptionNames().length + 1, 0);

    document.body.addEventListener('keyup', (kbd) => {
      if (!this.isShowing_ || !this.ignoreKeys_) return;
      kbd.stopPropagation();

      const key = this.currentlyBindingIdx_ === 0 ? 'binding1' : 'binding2';
      this.set(`actions_.${this.current_}.${key}`, kbd.code);

      if (this.currentlyBindingIdx_ === 0) {
        this.currentlyBindingIdx_++;
      } else {
        this.currentlyBindingIdx_ = undefined;
        this.ignoreKeys_ = false;

        const confirm = options.getOption('CONFIRM') as string[];
        if (confirm.indexOf(kbd.code) >= 0) {
          this.trapKeyup_ = true;
        }
      }
    });
  }

  ready() {
    super.ready();

    this.fillActions_();

    setTimeout(() => {
      this.menuItems_ =
          [...this.menuOptions_.querySelectorAll('paper-item')].filter((el) => {
        return [...this.menuOptions_.children].includes(el);
      });
      this.menuItems_[this.current_]!.classList.toggle('selected', true);
    });
  }

  show() {
    super.show();
    this.trapKeyup_ = true;
  }

  editStatus_(current: number, bindingIdx: number, idx: number) {
    const item = this.actions_[current];
    const whichBinding = idx === 0 ? 'binding1' : 'binding2';
    const boundValue = item[whichBinding];
    const opt = options.getOption(item.value) as string[];
    const changed = opt[idx] !== boundValue;
    const statuses = [
      current === this.current_ && bindingIdx === idx ? 'editing-binding' : '',
      changed ? 'binding-changed' : '',
    ];
    return statuses.join(' ');
  }

  protected bindingText_(value: string, binding: string, idx: number) {
    const opt = options.getOption(value) as string[];
    const changed = opt[idx] !== binding;
    if (changed && opt[idx] !== '') {
      return `${opt[idx]} \u{21d2} ${binding}`;
    } else {
      return binding;
    }
  }

  protected confirmAt_(current: number) {
    if (this.trapKeyup_) {
      this.trapKeyup_ = false;
      return;
    }
    const opt = current as ActionOptions;
    switch (opt) {
      case ActionOptions.ACTION_CONFIRM:
        // fallthrough
      case ActionOptions.ACTION_UP:
        // fallthrough
      case ActionOptions.ACTION_RIGHT:
        // fallthrough
      case ActionOptions.ACTION_DOWN:
        // fallthrough
      case ActionOptions.ACTION_LEFT:
        // fallthrough
      case ActionOptions.ACTION_MENU:
        // fallthrough
      case ActionOptions.ACTION_SELECT:
        // fallthrough
      case ActionOptions.ACTION_CANCEL:
        this.ignoreKeys_ = true;
        this.currentlyBindingIdx_ = 0;
        break;
      case ActionOptions.CONFIRM:
        this.saveBindings_();
        this.cancelAt_();
        break;
      default:
        assertUnreachable(opt);
    }
  }

  private saveBindings_() {
    this.actions_.forEach((action) => {
      options.setOption(action.value, [action.binding1, action.binding2]);
    });
    // TODO: send ajax request to /user/${properties.getProperty('userId')}/key
    /*
    body = this.actions_.reduce((body, value) => {
      body[value.value] = [value.binding1, value.binding2];
      return body;
    }, {} as {[key: string]: [string, string]});
    */
  }

  protected cancelAt_() {
    properties.setProperty('game-state', State.OPTIONS_MENU);
    this.actions_ = [];
    this.fillActions_();
    this.currentlyBindingIdx_ = -1;
    setTimeout(() => {
      super.currentChanged_(0, this.current_);
      this.current_ = 0;
    }, 500);
  }

  private fillActions_() {
    options.getOptionNames().forEach((name) => {
      const opt = options.getOptionData(name);
      if (!opt) return;
      const [binding1, binding2] = opt.current as string[];
      this.push('actions_', {
        value: name as Action,
        name: opt.label,
        binding1: binding1 || String.fromCharCode(160),
        binding2: binding2 || String.fromCharCode(160),
      });
    });
  }
}
