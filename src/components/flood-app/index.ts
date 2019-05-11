import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, observe, property, query } from '@polymer/decorators';

import '../keyboard-handler';
import { TitleMenu } from '../title-menu';
import * as template from './template.html';
import * as Util from '../../util';

import '../../common.scss?name=common';
import './index.scss?name=main';

enum State {
  SIGNIN = 'signin',
  TITLE_MENU = 'title menu',
  INTRO_SEQUENCE = 'intro sequence',
  FIELD = 'field',
  OPTIONS_MENU = 'options',
}

/**
 * Main app; much of the state will be stored here, and the only element of the
 * page the user interactis with that isn't a child of this component should be
 * the signin/signout button for Google accounts (the loader doesn't handle
 * being in a shadow root well)
 */
@customElement('flood-app')
export class FloodApp extends PolymerElement {
  @property() googleUser!: gapi.auth2.GoogleUser;

  private gameState_ = State.SIGNIN;
  @query('#titleMenu') protected titleMenu_!: TitleMenu;

  static get template() {
    // @ts-ignore
    return html([template]);
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
      this.gameState_ = State.TITLE_MENU;
    } else {
      this.gameState_ = State.SIGNIN;
    }
  }

  @observe('gameState_')
  protected gameStateChanged_() {
    switch (this.gameState_) {
      case State.SIGNIN:
        this.titleMenu_.style.opacity = '0';
        break;
      case State.TITLE_MENU:
        this.titleMenu_.style.opacity = '1';
        this.titleMenu_.grabFocus();
        break;
      case State.INTRO_SEQUENCE:
        break;
      case State.FIELD:
        break;
      case State.OPTIONS_MENU:
        break;
      default:
        Util.assertUnreachable(this.gameState_);
    }
  }

  protected handleKeyPressed_(e: CustomEvent) {
    console.log(e);
  }
}
