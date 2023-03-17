import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {OrderService} from "../../services/order-service.service";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {IPayPalConfig} from "ngx-paypal";

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css']
})
export class PaypalComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;
  constructor(private orderService:OrderService,
              private datePipe: DatePipe,
              private router: Router) { }

  ngOnInit(): void {
    this.initConfig();
  }

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    expirationDateControl: new FormControl('', Validators.required),
    securityCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
    number: new FormControl('', Validators.required),
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
          this.router.navigate(['/success']);
        }, error => {console.error(error);})
      }, error => {console.error(error);})
    }, error => {console.error(error);})

  }

  transformDate(inputDate: string): string {
    const dateArray = inputDate.split('/');
    const month = dateArray[0];
    const year = dateArray[1];
    const transformedDate= this.datePipe.transform(`${month}/01/${year}`, 'yyyy-MM');
    return transformedDate || "";
  }

  get f() {
    return this.form.controls;
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: '',
      clientId: '',
      createOrderOnServer: () => {
        return this.orderService.createOrders()
          .toPromise()
          .then((response: any) => response.id);
      },
      advanced: {
        commit: 'true'
      },
      style:{
        label:'paypal',
        layout:'vertical'
      },
      onApprove: (data: any) => {
        return this.orderService.capturePayment(data.orderID)
          .toPromise()
          .then(() => {
            this.router.navigate(['/success']);
          });
      },
      onCancel:(data: any, actions: any)=>{
        console.log('OnCancel', data, actions);

      },
      onError:(err :any)=>{
        console.log('OnError', err);

      },

    };
  }

}
