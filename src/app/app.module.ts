import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgxPayPalModule} from "ngx-paypal";
import { PaypalComponent } from './components/paypal/paypal.component';
import {HttpClientModule} from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonModule, DatePipe} from "@angular/common";
import { CardNumberDirective } from './directive/cardNumberDirective/card-number.directive';
import { ExpiryDateDirective } from './directive/expiryDateDirective/expiry-date.directive';
import {SuccessComponent} from './components/success/success.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbAccordionModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faCcMastercard, faCcPaypal, faCcVisa} from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    PaypalComponent,
    CardNumberDirective,
    ExpiryDateDirective,
    SuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPayPalModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbAccordionModule,
    MatSnackBarModule,
    FontAwesomeModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCcPaypal,faCcVisa,faCcMastercard);
  }
}
