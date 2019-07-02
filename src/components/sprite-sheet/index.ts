import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, property } from '@polymer/decorators';
import { SpriteConfig } from './sprite-config';
import './sprite-config';

import { default as template } from './template.html';

import './index.scss?name=sprite-sheet';

interface SpriteMap {
  [name: string]: SpriteConfig;
}

export interface Sprite {
  readonly element: HTMLDivElement;
  setFrame: (idx: number) => void;
  reset: () => void;
  play: () => void;
  stop: (completeLoop?: boolean) => void;
  swapTo: (name: string) => void;
}

@customElement('sprite-sheet')
export class SpriteSheet extends PolymerElement {
  @property() src = '';
  private sprites_: SpriteMap = {};

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  ready() {
    super.ready();

    const spritesConfig = this.querySelectorAll('sprite-config');
    [...spritesConfig].forEach((sc) => {
      const config = sc as SpriteConfig;
      this.sprites_[config.name] = config;
    });
  }

  spriteNames() {
    return Object.keys(this.sprites_);
  }

  createSprite(
      name: string,
      classList?: string | string[],
      style?: ElementCSSInlineStyle) {
    const divElement = document.createElement('div');
    if (classList) {
      if (typeof classList === 'string') {
        divElement.classList.add
            .apply(divElement.classList, classList.split(' '));
      } else {
        divElement.classList.add.apply(divElement.classList, classList);
      }
    }
    if (style) {
      Object.keys(style).forEach((key) => {
        (divElement.style as any)[key] = (style as any)[key];
      });
    }
    divElement.style.backgroundImage = `url(${this.src})`;

    let spriteConfig = this.sprites_[name];
    divElement.style.width = `${spriteConfig.width}px`;
    divElement.style.height = `${spriteConfig.height}px`;

    const moveToFrame = (idx: number) => {
      const frame = spriteConfig.frames[idx];
      divElement.style.backgroundPosition = `-${frame.x}px -${frame.y}px`;
    };

    let currentFrame = 0;
    let lastFrame = 0;
    let interval = 0;
    let stopAtNextLoop = false;
    const sprite: Sprite = {
      element: divElement,
      setFrame: (idx: number) => {
        currentFrame = idx;
        moveToFrame(idx);
      },
      reset: () => { sprite.setFrame(0); },
      play: () => {
        if (interval) return;

        lastFrame = Date.now();
        interval = window.setInterval(() => {
          const now = Date.now();
          const frame = spriteConfig.frames[currentFrame];
          if (now - lastFrame > frame.duration * 1000) {
            lastFrame += frame.duration * 1000;
            currentFrame++;
            currentFrame %= spriteConfig.frames.length;
            moveToFrame(currentFrame);
            if (currentFrame === 0 && stopAtNextLoop) {
              sprite.stop();
            }
          }
        }, 50);
      },
      stop: (completeLoop?: boolean) => {
        if (completeLoop) stopAtNextLoop = true;
        else {
          clearInterval(interval);
          interval = 0;
        }
      },
      swapTo: (name: string) => {
        spriteConfig = this.sprites_[name];
        sprite.reset();
      },
    };
    sprite.reset();

    return sprite;
  }
}
