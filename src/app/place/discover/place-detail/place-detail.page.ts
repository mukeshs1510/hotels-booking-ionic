import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { BookingService } from 'src/app/bookings/bookings.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { PlacesModel } from '../../places.model';
import { PlacesServiceService } from '../../service/places-service.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: PlacesModel
  private placeSub: Subscription
  isLoading = false
  isBookable = false

  constructor(private route: ActivatedRoute, 
    private navCtrl: NavController,
    private placeService: PlacesServiceService,
    private modalCntrlr: ModalController,
    private actionSheet: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(pm => {
      if(!pm.has('placeId')) {
       this.navCtrl.navigateBack('/place/tabs/discover')
       return
      }
      this.isLoading = true
      this.placeSub = this.placeService.getPlace(pm.get('placeId')).subscribe(place => {
        this.place = place
        this.isBookable = place.id !== this.authService.userId;
        this.isLoading = false
      }, error => {
        this.alertCtrl.create({
          header: "An error occured!",
          message: "Place could not be fetched, Please try again later",
          buttons: [{
            text: "Ok",
            handler: () => {
              this.router.navigate(['/place/tabs/discover'])
            }
          }]
        }).then(alert => {
          alert.present()
        })
      })
    });
  }

  onBackPlace() {
    // this.router.navigateByUrl('/place/tabs/discover');
    // this.navCtrl.navigateBack("/place/tabs/discover")

    this.actionSheet.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModel('select')
          }
        },
        {
          text: 'Select Time',
          handler: () => {
            this.openBookingModel('random')
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ]
    }).then(a => {
      a.present()
    })
  }

  openBookingModel(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCntrlr.create({component: CreateBookingComponent, componentProps: {
      selectedPlace: this.place,
      selectedMode: mode
    }}).then(m => {
      m.present()
      return m.onDidDismiss()
    })
    .then(resultData => {
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({
          message: "Booking your place..."
        }).then(lc => {
          lc.present()
          const data = resultData.data.bookingData
        this.bookingService.addBooking(
          this.place.id,
          this.place.title,
          this.place.desc,
          data.firstName,
          data.lastNam,
          data.guestNumber,
          data.startDate,
          data.endDate
          ).subscribe(() => {
            lc.dismiss()
          })
        })
      } 
    })

  }

  ngOnDestroy() {
    if(this.placeSub) {
      this.placeSub.unsubscribe()
    }
  }

}
