import { html } from '@polymer/polymer/polymer-element';
import { customElement, query, property } from '@polymer/decorators';
import { FloodScreen } from '../flood-screens';
import { PaperListboxElement } from '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import { default as template } from './name-selector.html';
import { MenuBehavior } from '../../mixins/menu-behavior';
import { Constructor } from '../../util';

import './index.scss?name=intro-sequence';

@customElement('name-selector')
export class NameSelector extends MenuBehavior
    (FloodScreen as unknown as Constructor<FloodScreen>) {
  @property() selectorName = '';
  @query('#selector') protected selector_!: PaperListboxElement;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  ready() {
    super.ready();
    setTimeout(() => {
      this.menuItems_ =
          [...this.selector_.items!];
      this.numItems_ = this.menuItems_.length;
      this.initial_ = 1;
      this.current_ = 1;
      this.menuItems_[this.current_]!.classList.toggle('selected', true);
    });
  }

  show() {
    super.show();
    this.classList.toggle('full', true);
  }

  hide() {
    super.hide();
    this.classList.toggle('full', false);
  }

  protected currentChanged_(current: number, previous: number) {
    if (current === 0) {
      if (previous === 1) {
        this.current_ = this.numItems_ - 1;
      } else {
        this.current_ = 1;
      }
      current = this.current_;
    }
    super.currentChanged_(current, previous);
  }

  protected confirmAt_(idx: number) {
    this.dispatchEvent(new CustomEvent('item-selected', {
      detail: {
        value: [...this.selector_.items!][idx].getAttribute('value'),
      },
      bubbles: true,
      composed: true,
    }));
  }
}
