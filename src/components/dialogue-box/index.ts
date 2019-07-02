import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, property, query } from '@polymer/decorators';
import { Sprite } from '../sprite-sheet';

import { default as template } from './template.html';
import { Service } from '../../options';

import './index.scss?name=dialogue-box';

const options = Service.getGameOptions();

@customElement('dialogue-box')
export class DialogueBox extends PolymerElement {
  @property() text = '';
  @property() lines: string[] = [];
  @query('#box') private box_!: HTMLDivElement;
  @query('#avatar') private avatar_!: HTMLDivElement;
  private sprite_?: Sprite;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  play(line: number) {
    const currentLine = this.lines[line];
    if (!currentLine) return;
    this.text = '';
    const isShowing = this.box_.classList.contains('full');
    this.box_.classList.toggle('full', true);
    setTimeout(() => {
      if (this.sprite_) this.sprite_.play();
      const currentLineArr = [...currentLine];
      const speedData = options.getOptionData('text_speed');
      const speedIdx = speedData!.possible!.indexOf(speedData!.current);
      const speed = (2 - speedIdx) ? speedIdx : .5;
      const interval = setInterval(() => {
        if (currentLineArr.length) {
          this.text += currentLineArr.shift();
        } else {
          if (this.sprite_) this.sprite_.stop(true);
          clearInterval(interval);
          this.box_.classList.toggle('next', true);
        }
      }, 100 * speed);
    }, isShowing ? 0 : 1000);
  }

  setAvatar(sprite: Sprite) {
    this.sprite_ = sprite;
    this.avatar_.innerHTML = '';
    this.avatar_.appendChild(sprite.element);
    const fontSize = Number((getComputedStyle(this.box_).fontSize || '32')
        .replace('px', ''));
    const boxMaxHeight = fontSize * 4;
    const padding = 8;
    const borderWidth = 6;
    const boxMaxInternalHeight = (boxMaxHeight - 2 * padding - 2 * borderWidth);
    const scale = boxMaxInternalHeight / sprite.element.clientHeight;
    sprite.element.style.transform = `scale(${scale})`;
    this.avatar_.style.width = `${sprite.element.clientWidth * scale}px`;
  }
}
