import { PolymerElement } from '@polymer/polymer/polymer-element';
import { customElement, property } from '@polymer/decorators';
import { Optional } from '../../util';

@customElement('sprite-config')
export class SpriteConfig extends PolymerElement {
  @property() name = '';
  @property() duration = 0;
  private frames_: SpriteFrame[] = [];

  get frames() { return this.frames_.slice(); }
  get width() {
    return this.frames_
        .reduce((width, frame) => Math.max(width, frame.width), 0);
  }
  get height() {
    return this.frames_
        .reduce((height, frame) => Math.max(height, frame.height), 0);
  }

  ready() {
    super.ready();

    const framesConfig = this.querySelectorAll('sprite-frame');
    let lastConfig: Optional<SpriteFrame>;
    [...framesConfig].forEach((sc) => {
      const config = sc as SpriteFrame;
      this.frames_.push(config);
      if (lastConfig) {
        if (!config.x) config.x = lastConfig.x;
        if (!config.y) config.y = lastConfig.y;
        if (!config.width) config.width = lastConfig.width;
        if (!config.height) config.height = lastConfig.height;
      }
      lastConfig = config;
    });

    const setDurations = this.frames_
        .reduce((sum, frame) => sum + frame.duration, 0);
    if (!this.duration) {
      this.duration = setDurations;
    } else {
      const diff = this.duration - setDurations;
      const unsetFrames = this.frames_.filter((frame) => frame.duration === 0);
      const durationPerUnset = diff / unsetFrames.length;
      unsetFrames.forEach((frame) => {
        frame.duration = durationPerUnset;
      });
    }
  }
}

@customElement('sprite-frame')
export class SpriteFrame extends PolymerElement {
  @property() x = 0;
  @property() y = 0;
  @property() width = 0;
  @property() height = 0;
  @property() duration = 0;
}
