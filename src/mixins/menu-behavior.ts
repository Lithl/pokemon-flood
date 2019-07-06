import { PolymerElement } from '@polymer/polymer/polymer-element';
import { PaperItemElement } from '@polymer/paper-item/paper-item';

import { Service } from '../options';
import { Constructor, Optional } from '../util';

const keys = Service.getKeybindOptions();

export function MenuBehavior<T extends Constructor<PolymerElement>>
    (superClass: T) {
  return class MenuBehavior extends superClass {
    protected current_ = 0;
    protected isShowing_ = false;
    protected ignoreKeys_ = false;
    protected menuItems_: Optional<PaperItemElement>[] = [];
    protected numItems_: number;
    protected initial_: number;

    constructor(...args: any[]) {
      super();
      this.numItems_ = args[0] as number;
      this.initial_ = args[1] as number;
      this.resetSelected_();
    }

    ready() {
      super.ready();
      document.body.addEventListener('keyup', (kbd) => {
        if (!this.isShowing_ || this.ignoreKeys_) return;

        const down = keys.getOption('DOWN') as string[];
        const up = keys.getOption('UP') as string[];
        const confirm = keys.getOption('CONFIRM') as string[];
        const cancel = keys.getOption('CANCEL') as string[];
        const right = keys.getOption('RIGHT') as string[];
        const left = keys.getOption('LEFT') as string[];
        const menu = keys.getOption('MENU') as string[];
        const select = keys.getOption('SELECT') as string[];

        if (down.indexOf(kbd.code) >= 0) {
          const prev = this.current_;
          this.current_ = (this.current_ + 1) % this.numItems_;
          this.currentChanged_(this.current_, prev);
        } else if (up.indexOf(kbd.code) >= 0) {
          const prev = this.current_;
          this.current_--;
          if (this.current_ < 0) {
            this.current_ += this.numItems_;
          }
          this.currentChanged_(this.current_, prev);
        } else if (confirm.indexOf(kbd.code) >= 0) {
          this.confirmAt_(this.current_);
        } else if (cancel.indexOf(kbd.code) >= 0) {
          this.cancelAt_(this.current_);
        } else if (right.indexOf(kbd.code) >= 0) {
          this.horizontalAt_(this.current_, false);
        } else if (left.indexOf(kbd.code) >= 0) {
          this.horizontalAt_(this.current_, true);
        } else if (menu.indexOf(kbd.code) >= 0) {
          this.menuAt_(this.current_);
        } else if (select.indexOf(kbd.code) >= 0) {
          this.selectAt_(this.current_);
        }
      });
    }

    private resetSelected_() {
      this.current_ = this.initial_;
    }

    protected currentChanged_(current: number, previous: number) {
      if (this.menuItems_[previous] && this.menuItems_[current]) {
        this.menuItems_[previous]!.classList.toggle('selected', false);
        this.menuItems_[current]!.classList.toggle('selected', true);
      }
    }

    protected confirmAt_(_idx: number) {
      // nop; implement in subclass
    }

    protected cancelAt_(_idx: number) {
      // nop: implement in subclass
    }

    protected horizontalAt_(_idx: number, _left: boolean) {
      // nop; implement in subclass
    }

    protected menuAt_(_idx: number) {
      // nop; implement in subclass
    }

    protected selectAt_(_idx: number) {
      // nop; implement in subclass
    }
  };
}
