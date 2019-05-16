import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, query, property } from '@polymer/decorators';
import { PaperListboxElement } from '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';

import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=title';

@customElement('title-menu')
export class TitleMenu extends PolymerElement {
  @query('#menuOptions') private menuOptions_!: PaperListboxElement;
  @property() protected saveGameAvailable_ = false;

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
}
