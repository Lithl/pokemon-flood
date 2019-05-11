import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, observe, property /*, query*/ } from '@polymer/decorators';

import '../keyboard-handler';
import * as template from './template.html';

import '../../common.scss?name=common';
import './index.scss?name=main';

/**
 * Main app; much of the state will be stored here, and the only element of the
 * page the user interactis with that isn't a child of this component should be
 * the signin/signout button for Google accounts (the loader doesn't handle
 * being in a shadow root well)
 */
@customElement('flood-app')
export class FloodApp extends PolymerElement {
  static get template() {
    // @ts-ignore
    return html([template]);
  }

  @property()
  googleUser!: gapi.auth2.GoogleUser;

  ready() {
    super.ready();
  }

  // reportBug() {
  //   open(
  //       'https://github.com/Lithl/flood-app/issues/new?labels=bug,triage&assignee=lithl',
  //       'bug-report');
  // }

  /**
   * User logged in or out of their Google account; enable/disable the Google
   * Drive export menu item
   */
  @observe('googleUser')
  protected googleUserChanged_(user: gapi.auth2.GoogleUser) {
    if (user) {
      setTimeout(() => {
        this.style.display = 'block';
      }, 1500);
    } else {
      this.style.display = 'none';
    }
  }

  protected handleKeyPressed_(e: CustomEvent) {
    console.log(e);
  }
}
