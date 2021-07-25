import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.modal';
import { PlacesServiceService } from '../../service/places-service.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup

  constructor(private placeService: PlacesServiceService,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      desc: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required,
        Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      loction: new FormControl(null, {
        validators: [Validators.required]
      })
    })
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({
      location: location
    })
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return
    }
    // console.log(this.form);
    this.loadingCtrl.create({
      message: "Creating place..."
    }).then((l) => {
      l.present()
      this.placeService.addPlace(this.form.value.title,
        this.form.value.desc,
        +this.form.value.price,
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo),
        this.form.value.location
        ).subscribe(() => {
          this.form.reset()
          l.dismiss()
          this.router.navigate(['/place/tabs/offers'])
        })
    })
    

  }

}
