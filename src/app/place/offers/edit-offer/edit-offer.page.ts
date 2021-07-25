import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PlacesModel } from '../../places.model';
import { PlacesServiceService } from '../../service/places-service.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  form: FormGroup
  private placeSub: Subscription
  isLoading = false

  placeId: string;
  place: PlacesModel

  constructor(private route: ActivatedRoute,
    private navCtrl: NavController,
    private placeService: PlacesServiceService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(pm => {
      if(!pm.has('placeId')) {
       this.navCtrl.navigateBack('/place/tabs/offers')
       return
      }
      this.placeId = pm.get('placeId')
      this.isLoading = true;
       this.placeSub = this.placeService.getPlace(pm.get('placeId')).subscribe(place => {
        this.place = place
        this.initReactiveForm();
        this.isLoading = false
      }, error => {
        this.alertCtrl.create({
          header: "An error occured!",
          message: "Place could not be fetched, Please try again later",
          buttons: [{
            text: "Ok",
            handler: () => {
              this.router.navigate(['/place/tabs/offers'])
            }
          }]
        }).then(alert => {
          alert.present()
        })
      })
    });

  }

  initReactiveForm() {
    this.form = new FormGroup({
      title: new FormControl(this.place.title, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      desc: new FormControl(this.place.desc, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      })
    })
  }

  onEditOffer() {
    if (!this.form.valid) {
      return
    }
    // console.log(this.form);
    this.loadingCtrl.create({
      message: "Updating place..."
    }).then(res => {
      res.present()
      this.placeService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.desc).subscribe(() => {
          res.dismiss()
          this.form.reset()
          this.router.navigate(["/place/tabs/offers"])
        })
    })
  }

  ngOnDestroy(): void {
    if(this.placeSub) {
      this.placeSub.unsubscribe()
    }
  }

}
