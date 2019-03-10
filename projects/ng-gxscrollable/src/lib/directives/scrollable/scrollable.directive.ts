import { AfterViewChecked, AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import defaults from 'lodash/defaults';
import isEqual from 'lodash/isEqual';

import {
  ComponentDestroyObserver,
  whileComponentNotDestroyed
} from '../../decorators/component-destroy-observer/component-destroy-observer';
import { filter } from 'rxjs/operators';

export interface ScrollableState {
  vertical?: {
    progress: number;
    viewportLength: number;
    scrollLength: number;
  };
  horizontal?: {
    progress: number;
    viewportLength: number;
    scrollLength: number;
  };
}

export interface ScrollableOptions {
  vertical?: boolean;
  horizontal?: boolean;
}

@Directive({
  selector: '[xsScrollable]',
  exportAs: 'scrollableDirective'
})
@ComponentDestroyObserver
export class ScrollableDirective implements OnInit, AfterViewInit, AfterViewChecked {

  @Input() xsScrollableOptions: ScrollableOptions;

  private _state = new BehaviorSubject<ScrollableState>(undefined);
  private dragging = false;
  private lastTouch;
  private defaultOptions: ScrollableOptions = {
    vertical: true,
    horizontal: false
  };

  get state() {
    return this._state.value;
  }

  get state$(): Observable<ScrollableState> {
    return this._state.asObservable();
  }

  set state(value) {
    this._state.next(value);
  }

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    fromEvent<WheelEvent>(this.el.nativeElement, 'wheel')
      .pipe(whileComponentNotDestroyed(this))
      .subscribe(e => {
        if (this.handleScroll(e.deltaX, e.deltaY)) {
          e.preventDefault();
        }
      });

    fromEvent<TouchEvent>(this.el.nativeElement, 'touchstart')
      .pipe(whileComponentNotDestroyed(this))
      .subscribe(e => {
        this.dragging = true;
        this.lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      });

    fromEvent<TouchEvent>(this.el.nativeElement, 'touchmove')
      .pipe(
        filter(() => this.dragging),
        whileComponentNotDestroyed(this)
      )
      .subscribe(e => {
        const touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        if (this.lastTouch && this.handleScroll(this.lastTouch.x - touch.x, this.lastTouch.y - touch.y)) {
          e.preventDefault();
        }

        this.lastTouch = touch;
      });

    merge([
      fromEvent<TouchEvent>(this.el.nativeElement, 'touchend'),
      fromEvent<TouchEvent>(this.el.nativeElement, 'touchcancel')
    ])
      .pipe(whileComponentNotDestroyed(this))
      .subscribe(() => this.dragging = false);

    fromEvent<WheelEvent>(this.el.nativeElement, 'scroll')
      .pipe(whileComponentNotDestroyed(this))
      .subscribe(() => this.updateState());

    this.updateState();
  }

  ngAfterViewChecked(): void {
    this.updateState();
  }

  get options(): ScrollableOptions {
    return defaults(this.xsScrollableOptions || {}, this.defaultOptions);
  }

  handleScroll(deltaX, deltaY) {
    let handled = false;

    if (this.options.vertical && !this.options.horizontal && Math.abs(deltaX) > Math.abs(deltaY)) {
      return handled;
    }

    if (!this.options.vertical && this.options.horizontal && Math.abs(deltaY) > Math.abs(deltaX)) {
      return handled;
    }

    if (this.options.vertical) {
      const prevPosition = this.el.nativeElement.scrollTop;

      this.el.nativeElement.scrollTop += deltaY;

      if (this.el.nativeElement.scrollTop != prevPosition) {
        handled = true;
      }
    }

    if (this.options.horizontal) {
      const prevPosition = this.el.nativeElement.scrollLeft;

      this.el.nativeElement.scrollLeft += deltaX;

      if (this.el.nativeElement.scrollLeft != prevPosition) {
        handled = true;
      }
    }

    return handled;
  }

  updateState() {
    const state = {};

    if (this.options.vertical) {
      state['vertical'] = {
        progress: (this.el.nativeElement.scrollHeight - this.el.nativeElement.offsetHeight)
          ? this.el.nativeElement.scrollTop / (this.el.nativeElement.scrollHeight - this.el.nativeElement.offsetHeight)
          : 1,
        viewportLength: this.el.nativeElement.offsetHeight,
        scrollLength: this.el.nativeElement.scrollHeight
      };
    }

    if (this.options.horizontal) {
      state['horizontal'] = {
        progress: (this.el.nativeElement.scrollWidth - this.el.nativeElement.offsetWidth)
          ? this.el.nativeElement.scrollLeft / (this.el.nativeElement.scrollWidth - this.el.nativeElement.offsetWidth)
          : 1,
        viewportLength: this.el.nativeElement.offsetWidth,
        scrollLength: this.el.nativeElement.scrollWidth
      };
    }

    if (isEqual(this.state, state)) {
      return;
    }

    this.state = state;
  }

  scrollTo(position) {
    if (this.options.vertical) {
      this.el.nativeElement.scrollTop = position;
    } else if (this.options.horizontal) {
      this.el.nativeElement.scrollLeft = position;
    }
  }
}
