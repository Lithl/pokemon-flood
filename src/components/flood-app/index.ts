import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, listen, observe, property, query } from '@polymer/decorators';
import { DeclarativeEventListeners } from '@polymer/decorators/lib/declarative-event-listeners';

import '../keyboard-handler';
import { TitleMenu } from '../title-menu';
import { OptionsMenu } from '../options-menu';
import * as template from './template.html';
import * as Util from '../../util';

import '../../common.scss?name=common';
import './index.scss?name=main';

export enum State {
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
export class FloodApp extends DeclarativeEventListeners(PolymerElement) {
  @property() googleUser!: gapi.auth2.GoogleUser;

  @property({
    type: String,
    observer: 'gameStateChanged_',
  }) private gameState_ = State.SIGNIN;

  @query('#titleMenu') protected titleMenu_!: TitleMenu;
  @query('#optionsMenu') protected optionsMenu_!: OptionsMenu;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  @listen('set-game-state', document)
  setGameState_(e: Event) {
    this.gameState_ = (e as CustomEvent).detail.newState as State;
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

  protected gameStateChanged_(curr: State, prev: State) {
    switch (curr) {
      case State.SIGNIN:
        this.titleMenu_.hide();
        this.optionsMenu_.hide();
        break;
      case State.TITLE_MENU:
        this.optionsMenu_.hide();
        this.titleMenu_.show();
        this.titleMenu_.grabFocus();
        break;
      case State.INTRO_SEQUENCE:
        break;
      case State.FIELD:
        break;
      case State.OPTIONS_MENU:
        this.titleMenu_.hide();
        this.optionsMenu_.show();
        this.optionsMenu_.returnState = prev;
        this.optionsMenu_.grabFocus();
        break;
      default:
        Util.assertUnreachable(curr);
    }
  }

  protected handleKeyPressed_(e: CustomEvent) {
    if (!e.detail.down && this.gameState_ === State.OPTIONS_MENU) {
      this.optionsMenu_.handleKeyPressed(e.detail.action);
    }
  }

  protected menuItemSelected_(e: CustomEvent) {
    switch (e.detail.selected) {
      case 'newGame':
        // move game state to INTRO_SEQUENCE
        break;
      case 'loadGame':
        // move game state to FIELD, loading saved game data
        break;
      case 'options':
        this.gameState_ = State.OPTIONS_MENU;
        break;
    }
  }
}
