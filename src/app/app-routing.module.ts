import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SuccessComponent} from "./components/success/success.component";
import {PaypalComponent} from "./components/paypal/paypal.component";

const routes: Routes = [
  {
    path: '',
    component: PaypalComponent
  },
  {
    path: 'success',
    component: SuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
