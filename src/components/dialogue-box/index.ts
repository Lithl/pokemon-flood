import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { customElement, property, query } from '@polymer/decorators';
import { Sprite } from '../sprite-sheet';

import { default as template } from './template.html';
import { Service } from '../../options';

import './index.scss?name=dialogue-box';

const options = Service.getGameOptions();
const keybindings = Service.getKeybindOptions();

interface DialgoueResponse {
  text: string;
  onSelect: () => void;
}

interface PlayDialogueOptions {
  onConfirm?: (avatar?: Sprite) => void;
  onComplete?: (avatar?: Sprite) => void;
  responses?: DialgoueResponse[];
}

interface LineData extends PlayDialogueOptions {
  text: string;
}

@customElement('dialogue-box')
export class DialogueBox extends PolymerElement {
  @property() text = '';
  @property() lines: Array<LineData | string> = [];
  @query('#box') private box_!: HTMLDivElement;
  @query('#avatar') private avatar_!: HTMLDivElement;
  private sprite_?: Sprite;

  static get template() {
    // @ts-ignore
    return html([template]);
  }

  play(line: number) {
    const currentLineData = this.lines[line];
    if (!currentLineData) return;
    const currentLine = (currentLineData as LineData).text
        || currentLineData as string;
    const playOptions: PlayDialogueOptions = {
      onConfirm: (currentLineData as PlayDialogueOptions).onConfirm || (() => {
        this.play(line + 1);
      }),
      onComplete: (currentLineData as PlayDialogueOptions).onComplete,
      responses: (currentLineData as PlayDialogueOptions).responses || [],
    };

    const keyPressHandler = (kbd: KeyboardEvent) => {
      const confirm = keybindings.getOption('CONFIRM') as string[];
      if (confirm.indexOf(kbd.code) >= 0) {
        this.box_.classList.toggle('next', false);
        playOptions.onConfirm!(this.sprite_);
        document.body.removeEventListener('keyup', keyPressHandler);
      }
    };

    this.text = '';
    const isShowing = this.box_.classList.contains('full');
    this.box_.classList.toggle('full', true);
    // wait for the `full` transition to complete if the dialogue box wasn't
    // already showing
    setTimeout(() => {
      if (this.sprite_) this.sprite_.play();
      const currentLineArr = [...currentLine];
      const speedData = options.getOptionData('text_speed');
      const speedIdx = speedData!.possible!.indexOf(speedData!.current);
      const speed = (2 - speedIdx) ? speedIdx : .5;
      const interval = setInterval(() => {
        if (currentLineArr.length) {
          // add next character to dialogue box
          this.text += currentLineArr.shift();
        } else {
          // all characters have been added
          if (this.sprite_) this.sprite_.stop(true);
          clearInterval(interval);

          if (playOptions.onComplete) {
            playOptions.onComplete(this.sprite_);
          } else {
            if (playOptions.responses!.length) {
              // TODO: show response list
            } else {
              this.box_.classList.toggle('next', true);
            }
            document.body.addEventListener('keyup', keyPressHandler);
          }
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
