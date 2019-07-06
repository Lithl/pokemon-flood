import { html } from '@polymer/polymer/polymer-element';
import { customElement, query } from '@polymer/decorators';
import { FloodScreen } from '../flood-screens';
import { SpriteSheet, Sprite } from '../sprite-sheet';
import { DialogueBox } from '../dialogue-box';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-item/paper-item';
import { NameSelector } from './name-selector';

import { default as template } from './template.html';
import { lerpPct, clamp } from '../../util';

import './index.scss?name=intro-sequence';

const eyeOpeningStops: {[key: string]: number} = {
  '0': 0,
  '500': 10,
  '750': 10,
  '1000': 2,
  '1500': 20,
  '1750': 20,
  '2250': 15,
  '3500': 40,
};

@customElement('intro-sequence')
export class IntroSequence extends FloodScreen {
  @query('#oak-dialogue') private oakDialogue_!: SpriteSheet;
  @query('#opening-eyes') private openEyes_!: HTMLDivElement;
  @query('#intro-text') private introText_!: DialogueBox;
  @query('#gender-selector') private genderSelector_!: NameSelector;
  @query('#male-name-selector') private maleNameSelector_!: NameSelector;
  @query('#female-name-selector') private femaleNameSelector_!: NameSelector;
  private start_ = 0;
  private interval_ = 0;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  ready() {
    super.ready();

    const eyesOpen = this.oakDialogue_.createSprite('closed');
    this.introText_.setAvatar(eyesOpen);
    this.introText_.lines = [
      {
        text: 'Owww, fuck, what hit us?',
        onConfirm: (avatar?: Sprite) => {
          if (avatar) avatar.swapTo('open');
          this.introText_.play(1);
        },
      },
      {
        text: 'Wait, who are you?',
        onComplete: () => {
          this.genderSelector_.show();
        },
      },
    ];
  }

  show() {
    super.show();

    this.introText_.play(0);
    setTimeout(() => {
      this.start_ = Date.now();
      this.interval_ = window.setInterval(() => {
        const pctOpen = this.computePctOpen_();
        this.openEyes_.style.backgroundImage =
            `radial-gradient(ellipse 60% ${pctOpen}%, transparent, black 75%)`;
        if (pctOpen === 40) {
          clearInterval(this.interval_);
          this.interval_ = 0;
          this.openEyes_.style.opacity = '0';
        }
      }, 50);
    }, 2000);
  }

  protected handleItemSelected_(e: CustomEvent) {
    const source = e.composedPath()[0] as NameSelector;
    if (source === this.genderSelector_) {
      const isMale = e.detail.value === 'male';
      source.hide();
      if (isMale) {
        this.maleNameSelector_.show();
      } else {
        this.femaleNameSelector_.show();
      }
    } else {
      this.maleNameSelector_.hide();
      this.femaleNameSelector_.hide();
      if (e.detail.value === 'custom') {
        // show name entry screen
      } else {
        // name := e.detail.value
      }
    }
  }

  private computePctOpen_() {
    const now = Date.now();
    const diff = now - this.start_;

    // find the stops before and after the current time
    let prevStop = 0;
    let nextStop = Number.MAX_SAFE_INTEGER;
    Object.keys(eyeOpeningStops).forEach((k) => {
      const stop = Number(k);
      if (stop <= diff && stop > prevStop) {
        prevStop = stop;
      }
      if (stop > diff && stop < nextStop) {
        nextStop = stop;
      }
    });
    nextStop = Math.min(
        nextStop,
        Object.keys(eyeOpeningStops)
            .reduce((max, stop) => Math.max(max, Number(stop)), 0));

    let pct = clamp((diff - prevStop) / (nextStop - prevStop), 0, 1);
    // in the case of prev == dif == next == max stop, pct is NaN
    if (isNaN(pct)) pct = 1;

    const pctSq = Math.pow(pct, 2);
    return lerpPct(
      eyeOpeningStops[prevStop],
      eyeOpeningStops[nextStop],
      // ease in-out function
      pctSq / (2 * (pctSq - pct) + 1));
  }
}
