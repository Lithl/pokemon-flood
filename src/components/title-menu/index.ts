import { html } from '@polymer/polymer/polymer-element';
import { customElement, property, query } from '@polymer/decorators';
import { FloodScreen } from '../flood-screens';
import { PaperListboxElement } from '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import * as template from './template.html';
import { MenuBehavior } from '../../mixins/menu-behavior';
import { Constructor, assertUnreachable } from '../../util';
import { Service } from '../../options';
import { State } from '../flood-app';

import './index.scss?name=title-menu';

const properties = Service.getGameProperties();

enum TitleMenuOptions {
  NEW_GAME = 0,
  CONTINUE = 1,
  OPTIONS = 2,
}

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
      this.menuItems_ =
          [...this.menuOptions_.querySelectorAll('paper-item')];
      if (!this.saveGameAvailable_) {
        this.menuItems_.splice(1, 0, undefined);
        // TODO: recompute menuItem_ when saveGameAvailable_ changes
      }
      this.menuItems_[this.current_]!.classList.toggle('selected', true);
    });
  }

  protected currentChanged_(current: number, previous: number) {
    if (!this.saveGameAvailable_) {
      if (current === 1) {
        if (previous === 2) this.current_ = 0;
        else this.current_ = 2;
        current = this.current_;
      }
    }

    super.currentChanged_(current, previous);
  }

  protected confirmAt_(current: number) {
    const opt = current as TitleMenuOptions;
    console.log('confirming in title screen');
    switch (opt) {
      case TitleMenuOptions.NEW_GAME:
        console.log('new game');
        break;
      case TitleMenuOptions.CONTINUE:
        console.log('continue save');
        break;
      case TitleMenuOptions.OPTIONS:
        properties.setProperty('game-state', State.OPTIONS_MENU);
        break;
      default:
        assertUnreachable(opt);
    }
  }
}
