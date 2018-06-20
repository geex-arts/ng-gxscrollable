import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollableDirective } from './directives/scrollable/scrollable.directive';
import { ScrollbarComponent } from './components/scrollbar/scrollbar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ScrollableDirective,
    ScrollbarComponent
  ],
  exports: [
    ScrollableDirective,
    ScrollbarComponent
  ]
})
export class NgGxScrollableModule { }
