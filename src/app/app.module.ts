import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgXScrollableModule } from '../../projects/ng-xscrollable/src/lib/ng-xscrollable.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgXScrollableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
