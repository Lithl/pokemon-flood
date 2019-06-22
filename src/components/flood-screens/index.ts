import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement } from '@polymer/decorators';

import * as template from './template.html';

import './index.scss?name=flood-screens';

@customElement('flood-screens')
export class FloodScreens extends PolymerElement {
  // private currentScreen_ = 0;
  private screens_: {[name: string]: FloodScreen} = {};

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  ready() {
    super.ready();

    const children = [...this.children];
    children.forEach((child) => {
      const name = (child && child.getAttribute('screen-name')) || '';
      this.screens_[name] = child as FloodScreen;
    });
  }

  hideAllScreens() {
    Object.keys(this.screens_).forEach((k) => {
      this.screens_[k].hide();
    });
  }

  showScreen(name: string) {
    const screenNames = Object.keys(this.screens_);
    screenNames.filter((n) => n !== name).forEach((k) => {
      this.screens_[k].hide();
    });
    this.screens_[name].show();
  }
}

export abstract class FloodScreen extends PolymerElement {
  ready() {
    super.ready();
    this.style.transition = 'opacity .5s';
    this.hide();
  }

  show() {
    this.style.opacity = '1';
    this.style.zIndex = '2';
  }

  hide() {
    this.style.opacity = '0';
    this.style.zIndex = '-1';
  }
}
