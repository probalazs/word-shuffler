import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import arrayShuffle from 'array-shuffle';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgbModule, ClipboardModule],
  providers: [{ provide: 'shuffle', useValue: arrayShuffle }],
  bootstrap: [AppComponent],
})
export class AppModule {}
