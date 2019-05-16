import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, query, property } from '@polymer/decorators';
import { PaperListboxElement } from '@polymer/paper-listbox/paper-listbox';
import { PaperItemElement } from '@polymer/paper-item/paper-item';

import { State } from '../flood-app';
import { Action } from '../keyboard-handler';
import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=options';

@customElement('options-menu')
export class OptionsMenu extends PolymerElement {
  @property() returnState: State = State.TITLE_MENU;
  @query('#menuOptions') private menuOptions_!: PaperListboxElement;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  grabFocus() {
    this.menuOptions_.focus();
  }

  show() {
    this.style.opacity = '1';
  }

  hide() {
    this.style.opacity = '0';
  }

  handleKeyPressed(action: Action) {
    const selectedRow = this.menuOptions_.focusedItem as PaperItemElement;
    const options = selectedRow && selectedRow.querySelector('paper-listbox');
    if (options) {
      if (action === Action.LEFT) {
        options.selectPrevious();
      } else if (action === Action.RIGHT) {
        options.selectNext();
      }
    }
  }

  protected optionItemSelected_(e: CustomEvent) {
    e.stopPropagation();
    switch (e.detail.selected) {
      case 'textSpeed':
        // fallthrough
      case 'battleEffects':
        // fallthrough
      case 'battleStyle':
        // fallthrough
      case 'music':
        // fallthrough
      case 'sfx':
        // fallthough
      case 'cries':
        // nop; these items use left/right to select values
        break;
      case 'keybindings':
        // move to keybindings options menu
        break;
      case 'confirm':
        this.dispatchEvent(new CustomEvent('set-game-state', {
          bubbles: true,
          composed: true,
          detail: {
            newState: this.returnState,
          },
        }));
        break;
    }
  }
}
