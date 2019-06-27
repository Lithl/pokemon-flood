import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, property, observe, query } from '@polymer/decorators';
import { FloodScreens } from '../flood-screens';
import '../title-menu';
import '../options-menu';

import * as template from './template.html';
import { Service } from '../../options';
import { Reactor, Reaction } from '../../reactor';
import { assertUnreachable } from '../../util';

import './index.scss?name=flood-app';

export enum State {
  SIGNIN = 'signin',
  TITLE_MENU = 'title menu',
  INTRO_SEQUENCE = 'intro sequence',
  FIELD = 'field',
  OPTIONS_MENU = 'options',
  KEYBINDING_MENU = 'edit keybindings',
}

const properties = Service.getGameProperties();
properties.setProperty('game-state', State.SIGNIN);

const reactor = Reactor.instance;

@customElement('flood-app')
export class FloodApp extends PolymerElement {
  @property() googleUser!: gapi.auth2.GoogleUser;

  @query('#topLevelScreens') protected screens_!: FloodScreens;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  constructor() {
    super();
    reactor.addEventListener('property-changed',
        (reaction) => this.propertyChanged_(reaction));
  }

  @observe('googleUser')
  protected googleUserChanged_(user: gapi.auth2.GoogleUser) {
    if (user) {
      properties.setProperty('game-state', State.TITLE_MENU);
      properties.setProperty('user-id', user.getId());
      // this.keybindingAjax_.url = `/user/${user.getId()}/keys`;
      // this.keybindingAjax_.generateRequest();
    } else {
      properties.setProperty('game-state', State.SIGNIN);
      properties.deleteProperty('user-id');
    }
  }

  private propertyChanged_(reaction: Reaction) {
    if (reaction.detail.name === 'game-state') {
      const newState = reaction.detail.newValue as State;
      switch (newState) {
        case State.SIGNIN:
          this.screens_.hideAllScreens();
          break;
        case State.TITLE_MENU:
          this.screens_.showScreen(State.TITLE_MENU);
          break;
        case State.INTRO_SEQUENCE:
          break;
        case State.FIELD:
          break;
        case State.OPTIONS_MENU:
          this.screens_.showScreen(
            State.OPTIONS_MENU,
            'returnState',
            reaction.detail.previousValue);
          break;
        case State.KEYBINDING_MENU:
          break;
        default:
          assertUnreachable(newState);
      }
      console.log(`game state changed from ${reaction.detail.previousValue} to
          ${reaction.detail.newValue}`);
    }
  }
}
