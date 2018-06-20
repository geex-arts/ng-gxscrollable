import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgGxScrollableModule } from '../../projects/ng-gxscrollable/src/lib/ng-gxscrollable.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgGxScrollableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
