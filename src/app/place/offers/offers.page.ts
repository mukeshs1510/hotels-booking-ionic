import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PlacesModel } from '../places.model';
import { PlacesServiceService } from '../service/places-service.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offer: PlacesModel[];
  private placesSub: Subscription
  isLoading = false

  constructor(
    private placesService: PlacesServiceService,
    private router: Router
    ) { }

  ngOnInit() {
    // this.offer = this.placesService.Places
    this.placesSub = this.placesService.Places.subscribe(places => {
      this.offer = places
    })

  }

  ionViewWillEnter() {
    this.isLoading = true
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false
    })
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close()
    this.router.navigate(['/','place','tabs','offers','edit', id])
    console.log("Editing on :"+id)
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe()
    }
  }

}
