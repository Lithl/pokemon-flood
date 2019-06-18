import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, query } from '@polymer/decorators';
import { PaperListboxElement } from '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

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

@customElement('keybindings-menu')
export class KeybindingsMenu extends PolymerElement {
  @query('#menuOptions') private menuOptions_!: PaperListboxElement;
  private actions_: ActionBinding[] = [];
  private editAction_?: Action;
  private isShowing_ = false;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  ready() {
    super.ready();

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

    this.addEventListener('keyup', (kbd) => {
      kbd.preventDefault();

      if (kbd.code === 'ArrowUp') {
        kbd.stopPropagation();
        this.menuOptions_._focusNext();
      }
      if (kbd.code === 'ArrowDown') {
        kbd.stopPropagation();
        this.menuOptions_._focusPrevious();
      }

      if ((options.getOption('CONFIRM') as string[]).indexOf(kbd.code) >= 0) {
        this.optionItemSelected_(this.menuOptions_.selected as string);
      }

      if ((options.getOption('DOWN') as string[]).indexOf(kbd.code) >= 0) {
        this.menuOptions_._focusNext();
      }

      if ((options.getOption('UP') as string[]).indexOf(kbd.code) >= 0) {
        this.menuOptions_._focusPrevious();
      }
    });
    document.body.addEventListener('keyup', (kbd) => {
      if (!this.isShowing_) return;
      if ((options.getOption('CANCEL') as string[]).indexOf(kbd.code) >= 0) {
        this.close_();
      }
    });
  }

  grabFocus() {
    this.menuOptions_.focus();
  }

  show() {
    this.style.opacity = '1';
    this.isShowing_ = true;
  }

  hide() {
    this.style.opacity = '0';
    this.isShowing_ = false;
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

        this.close_();
        break;
    }
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

    this.menuOptions_.selectIndex(-1);
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
    const opt = options.getOption(value) as string[]
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
}
