import { html } from '@polymer/polymer/polymer-element';
import { customElement, property, query } from '@polymer/decorators';
import { FloodScreen } from '../flood-screens';
import { PaperListboxElement } from '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import { PaperItemElement } from '@polymer/paper-item/paper-item';

import * as template from './template.html';
import { MenuBehavior } from '../../mixins/menu-behavior';
import { Constructor, Optional } from '../../util';

import './index.scss?name=title-menu';

@customElement('title-menu')
export class TitleMenu extends MenuBehavior
    (FloodScreen as unknown as Constructor<FloodScreen>) {
  @property() private saveGameAvailable_ = false;

  @query('#menuOptions') protected menuOptions_!: PaperListboxElement;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  constructor() {
    super(3, 0);
    if (this.saveGameAvailable_) {
      this.current_ = 1;
    }
  }

  ready() {
    super.ready();
    setTimeout(() => {
      const menuItems: Optional<PaperItemElement>[] =
          [...this.menuOptions_.querySelectorAll('paper-item')];
      if (!this.saveGameAvailable_) {
        menuItems.splice(1, 0, undefined);
      }
      menuItems[this.current_]!.classList.toggle('selected', true);
    });
  }

  show() {
    super.show();
    this.isShowing_ = true;
  }

  hide() {
    super.hide();
    this.isShowing_ = false;
  }

  protected currentChanged_(current: number, previous: number) {
    const menuItems: Optional<PaperItemElement>[] =
        [...this.menuOptions_.querySelectorAll('paper-item')];
    if (!this.saveGameAvailable_) {
      if (current === 1) {
        if (previous === 2) this.current_ = 0;
        else this.current_ = 2;
        current = this.current_;
      }
      menuItems.splice(1, 0, undefined);
    }

    menuItems[previous]!.classList.toggle('selected', false);
    menuItems[current]!.classList.toggle('selected', true);
  }
}
