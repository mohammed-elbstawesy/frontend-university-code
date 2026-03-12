import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Navbar } from '../user-layout/home/navbar/navbar';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,Navbar ],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
  planName: string = 'Standard Plan';
  planPrice: number = 99;
  subtotal: number = 99;
  tax: number = 4.95;
  total: number = 103.95;

  paymentMethod: 'card' | 'paypal' = 'card';
  promoCode: string = '';
  promoMsg: string = '';
  promoApplied: boolean = false;

  isProcessing: boolean = false;
  paymentSuccess: boolean = false;

  constructor(private route: ActivatedRoute, private toastService: ToastService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const plan = params['plan'] || 'standard';
      const plans: { [key: string]: { name: string, price: number } } = {
        standard: { name: 'Standard Plan', price: 99 },
        premium: { name: 'Premium Plan', price: 199 },
        enterprise: { name: 'Enterprise Plan', price: 499 },
      };

      const selected = plans[plan] || plans['standard'];
      this.planName = selected.name;
      this.planPrice = selected.price;
      this.subtotal = selected.price;
      this.tax = selected.price * 0.05;
      this.total = this.subtotal + this.tax;
    });
  }

  setPaymentMethod(method: 'card' | 'paypal'): void {
    this.paymentMethod = method;
  }

  applyPromo(): void {
    const code = this.promoCode.trim().toUpperCase();
    if (code === 'SAVE20') {
      const discount = this.total * 0.20;
      this.total = this.total - discount;
      this.promoMsg = '20% Discount Applied!';
      this.promoApplied = true;
    } else {
      this.promoMsg = 'Invalid Promo Code';
      this.promoApplied = false;
    }
  }

  handleCheckout(method: string): void {
    this.isProcessing = true;

    setTimeout(() => {
      this.isProcessing = false;
      this.paymentSuccess = true;
      this.toastService.show(`Payment Successful using ${method === 'card' ? 'Credit Card' : 'PayPal'}! Receipt sent to email.`, 'success');
    }, 2000);
  }
}
