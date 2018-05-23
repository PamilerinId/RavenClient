import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(public alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe( message => {
      this.message = message; });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
