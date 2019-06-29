import { html } from '@polymer/polymer/polymer-element';
import { customElement, property, query } from '@polymer/decorators';
import { PaperListboxElement } from '@polymer/paper-listbox';
import { IronAjaxElement } from '@polymer/iron-ajax';
import { MenuBehavior } from '../../mixins/menu-behavior';
import { FloodScreen } from '../flood-screens';
import { State } from '../flood-app';

import { default as template } from './template.html';
import { Service } from '../../options';
import { Constructor, assertUnreachable, Optional } from '../../util';
import { Reactor, Reaction } from '../../reactor';

import './index.scss?name=options-menu';

const options = Service.getGameOptions();
const properties = Service.getGameProperties();

const reactor = Reactor.instance;

interface OptionsModel {
  name: string;
  label: string;
  possibleValues: string[];
  current: string;
}

enum GameOptions {
  TEXT_SPEED = 0,
  BATTLE_EFFECTS = 1,
  BATTLE_STYLE = 2,
  MUSIC_VOLUME = 3,
  EFFECT_VOLUME = 4,
  POKEMON_CRIES = 5,
  EDIT_KEYBINDINGS = 6,
  CONFIRM = 7,
}

@customElement('options-menu')
export class OptionsMenu extends MenuBehavior
    (FloodScreen as unknown as Constructor<FloodScreen>) {
  @query('#menuOptions') private menuOptions_!: PaperListboxElement;
  @query('#saveOptions') private optionsAjax_!: IronAjaxElement;
  @property() private options_: OptionsModel[] = [];
  @property() returnState: Optional<State>;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  constructor() {
    super(options.getOptionNames().length + 2, 0);

    reactor.addEventListener('option-changed',
        (reaction) => this.optionChanged_(reaction));
  }

  ready() {
    super.ready();

    options.getOptionNames().forEach((name) => {
      const data = options.getOptionData(name);
      if (!data) return;

      this.options_.push({
        name,
        label: data.label,
        possibleValues: data.possible as string[],
        current: data.current as string,
      });
    });

    setTimeout(() => {
      this.menuItems_ =
          [...this.menuOptions_.querySelectorAll('paper-item')].filter((el) => {
        return [...this.menuOptions_.children].includes(el);
      });
      this.menuItems_[this.current_]!.classList.toggle('selected', true);
    });
  }

  private optionChanged_(reaction: Reaction) {
    const opt = reaction.detail.newValue;
    const value = reaction.detail.name;
    const optionsIdx = this.options_.findIndex((o) => o.name === value);
    if (optionsIdx >= 0) {
      this.set(`options_.${optionsIdx}.current`, opt);
    }
  }

  protected horizontalAt_(idx: number, left: boolean) {
    const option = this.options_[idx];
    if (!option) return;

    let currentIdx = option.possibleValues.indexOf(option.current);
    if (currentIdx < 0) return;

    if (left) currentIdx--;
    else currentIdx++;
    currentIdx = Math.min(
      Math.max(currentIdx, 0),
      option.possibleValues.length - 1);

    option.current = option.possibleValues[currentIdx];
    this.notifyPath(`options_.${idx}.current`, option.current);
  }

  protected confirmAt_(current: number) {
    const opt = current as GameOptions;
    switch (opt) {
      case GameOptions.TEXT_SPEED:
        // fallthrough
      case GameOptions.BATTLE_EFFECTS:
        // fallthrough
      case GameOptions.BATTLE_STYLE:
        // fallthrough
      case GameOptions.MUSIC_VOLUME:
        // fallthrough
      case GameOptions.EFFECT_VOLUME:
        // fallthrough
      case GameOptions.POKEMON_CRIES:
        // nop; these options are selected with left/right
        break;
      case GameOptions.EDIT_KEYBINDINGS:
        properties.setProperty('game-state', State.KEYBINDING_MENU);
        break;
      case GameOptions.CONFIRM:
        this.options_.forEach((option) => {
          options.setOption(option.name, option.current);
        });
        const id = properties.getProperty('user-id');
        this.optionsAjax_.url = `/user/${id}/options`;
        this.optionsAjax_.body = this.options_.reduce((body, value) => {
          body[value.name] = value.current;
          return body;
        }, {} as {[key: string]: string | number});
        this.optionsAjax_.generateRequest();
        this.cancelAt_();
        break;
      default:
        assertUnreachable(opt);
    }
  }

  protected handleSaveError_(err: CustomEvent) {
    console.error(err.detail.error);
  }

  protected cancelAt_() {
    if (this.returnState) {
      properties.setProperty('game-state', this.returnState);
      this.returnState = undefined;
      setTimeout(() => {
        super.currentChanged_(0, this.current_);
        this.current_ = 0;
      }, 500);
    }
  }

  protected isCurrentValue_(optionValue: string, option: string) {
    return option === optionValue ? 'selected' : '';
  }
}
