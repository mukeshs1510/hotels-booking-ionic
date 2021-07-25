import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { BookingsModel } from './bookings.model';
import { BookingService } from './bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: BookingsModel[]
  private bookingSub: Subscription
  isLoading = false

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
     this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings
    })
  }

  ionViewWillEnter() {
    this.isLoading = true
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false
    })
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close()
    this.loadingCtrl.create({
      message: "Canceling your booking..."
    }).then(res => {
      res.present()
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        res.dismiss()
      })

    })
    
  }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe()
    }
  }

}
