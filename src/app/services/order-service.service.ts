import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _ordersUrl = "http://localhost:8080/api/orders";


  constructor(private http: HttpClient) { }

  createOrders() {
    return this.http.post<any>(this._ordersUrl,null);
  }

  capturePayment(orderID: number) {
    return this.http.post<any>(this._ordersUrl + '/' + orderID + '/capture',null);
  }

  confirmPaymentSource(orderID: number, body: any) {
    return this.http.post<any>(this._ordersUrl + '/' + orderID + '/confirm-payment', body);
  }

}
