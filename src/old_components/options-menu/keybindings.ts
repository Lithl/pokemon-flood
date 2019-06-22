import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, query, property } from '@polymer/decorators';
import { PaperListboxElement } from '@polymer/paper-listbox/paper-listbox';
import { IronAjaxElement } from '@polymer/iron-ajax/iron-ajax';
import '@polymer/paper-item/paper-item';
import '@polymer/iron-ajax/iron-ajax';

import { Action, Service } from '../../options';
import * as template from './keybindings.html';

import '../../common.scss?name=common';
import './index.scss?name=options';

interface ActionBinding {
  value: Action;
  name: string;
  binding1: string;
  binding2: string;
}

const options = Service.getKeybindOptions();
const properties = Service.getGameProperties();

@customElement('keybindings-menu')
export class KeybindingsMenu extends PolymerElement {
  @query('#menuOptions') private menuOptions_!: PaperListboxElement;
  @query('#saveKeybindings') private saveKeybindings_!: IronAjaxElement;
  @property() private actions_: ActionBinding[] = [];
  @property() protected keybindingsEndpoint_ = '';
  private editAction_?: Action;
  private isShowing_ = false;
  private isTransitioning_ = false;
  private current_ = 0;
  private editingBinding_ = false;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  ready() {
    super.ready();

    this.computeActions();

    document.body.addEventListener('keyup', (kbd) => {
      if (!this.isShowing_) return;
      if (this.isTransitioning_) {
        this.isTransitioning_ = false;
        return;
      }
      kbd.preventDefault();

      if (!this.editingBinding_) {
        if ((options.getOption('DOWN') as string[]).indexOf(kbd.code) >= 0) {
          this.current_ = (this.current_ + 1) % (this.actions_.length + 1);
        } else if ((options.getOption('UP') as string[])
            .indexOf(kbd.code) >= 0) {
          this.current_--;
          if (this.current_ < 0) {
            this.current_ += this.actions_.length + 1;
          }
        } else if ((options.getOption('CONFIRM') as string[]).indexOf(kbd.code) >= 0) {
          if (this.current_ < this.actions_.length) {
            this.optionItemSelected_(this.actions_[this.current_].value);
          } else {
            this.optionItemSelected_('confirm');
          }
        }
      }
    });
    document.body.addEventListener('keyup', (kbd) => {
      if (!this.isShowing_) return;
      if ((options.getOption('CANCEL') as string[]).indexOf(kbd.code) >= 0) {
        this.close_();
      }
    });

    this.computeBindings();
  }

  computeActions() {
    this.actions_ = [];
    options.getOptionNames().forEach((name) => {
      const opt = options.getOptionData(name);
      if (!opt) return;
      const [binding1, binding2] = opt.current as string[];
      this.actions_.push({
        value: name as Action,
        name: opt.label,
        binding1: binding1 || String.fromCharCode(160),
        binding2: binding2 || String.fromCharCode(160),
      });
    });
  }

  computeBindings() {
    this.keybindingsEndpoint_ =
        `/user/${properties.getProperty('userId')}/keys`;
  }

  grabFocus() {
    this.menuOptions_.focus();
  }

  show() {
    this.style.opacity = '1';
    this.style.zIndex = '2';
    this.isShowing_ = true;
    this.isTransitioning_ = true;
  }

  hide() {
    this.style.opacity = '0';
    this.style.zIndex = '-1';
    this.isShowing_ = false;
  }

  protected isCurrent_(index: number, current: number) {
    return current === index ? 'is-selected' : '';
  }

  private optionItemSelected_(code: string) {
    switch (code) {
      case 'CONFIRM':
        // fallthrough
      case 'UP':
        // fallthrough
      case 'RIGHT':
        // fallthrough
      case 'DOWN':
        // fallthrough
      case 'LEFT':
        // fallthough
      case 'MENU':
        // fallthrough
      case 'SELECT':
        // fallthroguh
      case 'CANCEL':
        if (!this.editAction_) {
          this.editAction_ = code as Action;
          this.handleEditBinding_(0, () => this.handleEditBinding_(1));
        }
        break;
      case 'confirm':
        this.actions_.forEach((action) => {
          options.setOption(
              action.value as string,
              [action.binding1, action.binding2]);
        });
        this.saveBindings();

        this.close_();
        break;
    }
  }

  saveBindings() {
    this.saveKeybindings_.body = this.actions_.reduce((body, value) => {
      body[value.value] = [value.binding1, value.binding2];
      return body;
    }, {} as {[key: string]: [string, string]});
    this.saveKeybindings_.generateRequest();
  }

  private close_() {
    this.actions_ = [];
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

    const rows =
        [...this.menuOptions_.querySelectorAll(':scope > paper-item')];
    rows.forEach((row) => {
      const list = row.querySelector('paper-listbox');
      if (!list) return;
      [...list.children].forEach((child) => {
        child.classList.toggle('binding-changed', false);
      });
    });

    this.current_ = 0;
    this.hide();
    (this.parentNode as any).host.grabFocus();
  }

  protected editBindingDirect_(e: CustomEvent) {
    e.stopPropagation();
    this.editAction_ = e.detail.item.parentNode.parentNode.value;
    if (e.detail.selected === 'key1') {
      this.handleEditBinding_(0);
    } else {
      this.handleEditBinding_(1);
    }
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

  private handleEditBinding_(idx: number, cb?: () => void) {
    const row = [...this.menuOptions_.querySelectorAll(':scope > paper-item')]
        .find((elem) =>  (elem as any).value === this.editAction_);
    if (!row) return;
    const list = row.querySelector('paper-listbox');
    if (!list) return;
    const nthItem = list.querySelector(`:nth-child(${idx + 1})`);
    if (!nthItem) return;

    nthItem.classList.toggle('edit-binding', true);
    this.editingBinding_ = true;

    const newBinding = (kbd: KeyboardEvent) => {
      kbd.preventDefault();
      kbd.stopPropagation();

      const actionIdx = this.actions_.findIndex((val: ActionBinding) => {
        return val.value === this.editAction_;
      });
      const key = idx === 0 ? 'binding1' : 'binding2';
      this.set(`actions_.${actionIdx}.${key}`, kbd.code);

      const opt = options.getOption(this.editAction_ as string) as string[];
      nthItem.classList.toggle('binding-changed', opt[idx] !== kbd.code);

      nthItem.classList.toggle('edit-binding', false);

      document.body.removeEventListener('keyup', newBinding);
      if (cb) {
        cb();
      } else {
        list.selectedValues = [];
        this.grabFocus();
        this.editAction_ = undefined;
        this.editingBinding_ = false;
      }
    };
    const nextKeyup = (kbd: KeyboardEvent) => {
      kbd.preventDefault();
      kbd.stopPropagation();
      document.body.removeEventListener('keyup', nextKeyup);
      document.body.addEventListener('keyup', newBinding);
    };

    document.body.addEventListener('keyup', cb ? nextKeyup : newBinding);
  }

  protected handleSaveError_(e: CustomEvent) {
    console.error('Error saving keybindings', e.detail);
  }
}
