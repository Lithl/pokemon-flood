import { html } from '@polymer/polymer/polymer-element';
import { customElement, query } from '@polymer/decorators';
import { FloodScreen } from '../flood-screens';
import { SpriteSheet } from '../sprite-sheet';

import { default as template } from './template.html';
import { lerpPct, clamp } from '../../util';

import './index.scss?name=intro-sequence';

const eyeOpeningStops: {[key: string]: number} = {
  '0': 0,
  '500': 10,
  '750': 2,
  '1250': 20,
  '1750': 15,
  '3000': 40,
};

@customElement('intro-sequence')
export class IntroSequence extends FloodScreen {
  @query('#oak-dialogue') private oakDialogue_!: SpriteSheet;
  @query('#opening-eyes') private openEyes_!: HTMLDivElement;
  private start_ = 0;
  private interval_ = 0;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  ready() {
    super.ready();

    const eyesOpen = this.oakDialogue_.createSprite('open');
    this.shadowRoot!.appendChild(eyesOpen.element);
  }

  show() {
    super.show();

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
