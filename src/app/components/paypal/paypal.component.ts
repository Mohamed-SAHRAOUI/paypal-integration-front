import { Component, OnInit } from '@angular/core';
import {ICreateOrderRequest, IPayPalConfig} from "ngx-paypal";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {OrderService} from "../../services/order-service.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {

  private showSuccess: boolean | undefined;
  private showCancel: boolean | undefined;
  private showError: boolean | undefined;
  public payPalConfig ? : IPayPalConfig;

  constructor(private orderService:OrderService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initConfig();
  }

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    expirationDateControl: new FormControl('', [Validators.required]),
    securityCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
    number: new FormControl('', [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16),
      Validators.pattern('[0-9]*')
    ]),
    addressLine1: new FormControl(''),
    adminArea2: new FormControl(''),
    postalCode: new FormControl(''),
    countryCode: new FormControl('', Validators.required)
  });

  onSubmit() {
    const customData = {
      "payment_source": {
        "card":{
          "number": this.form.value.number,
          "expiry": this.transformDate(this.form.value.expirationDateControl || ""),
          "securityCode": this.form.value.securityCode,
          "name": this.form.value.name,
          "billingAddress":{
            "addressLine1": this.form.value.addressLine1,
            "adminArea2": this.form.value.adminArea2,
            "postalCode": this.form.value.postalCode,
            "countryCode": this.form.value.countryCode
          }
        }
      }
    };
    this.orderService.createOrders().subscribe(res => {
      const orderId = res.id;
      this.orderService.confirmPaymentSource(orderId, customData).subscribe(res => {
        this.orderService.capturePayment(orderId).subscribe(res => {
          alert('Transaction completed!');
        }, error => {})
      }, error => {})
    }, error => {})

  }

  transformDate(inputDate: string): string {
    const dateArray = inputDate.split('/');
    const month = dateArray[0];
    const year = dateArray[1];
    console.log(month);
    console.log(year);
    const transformedDate= this.datePipe.transform(`${month}/01/${year}`, 'yyyy-MM');
    console.log(transformedDate);
    return transformedDate || "";
  }

  get f() {
    return this.form.controls;
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'ARcH6XwhNehcMGbnkDb5LyATL2zybxR74kWtSbxN2IUukqn9JzjxTyVF7SZxcMfHGBc6zr5vrH1a7bWH',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: '9.99',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '9.99'
              }
            }
          }
        }]
      },
      advanced: {
        commit: 'true',
        extraQueryParams: [ { name: "disable-funding", value:"credit,card"} ]
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }

}
