import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PlacesModel } from '../places.model';
import { PlacesServiceService } from '../service/places-service.service';
import { SegmentChangeEventDetail } from '@ionic/core'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: PlacesModel[]
  listedLoadedPlaces: PlacesModel[]
  private placesSub: Subscription
  relaventPlaces: PlacesModel[]
  isLoading = false

  constructor(
    private placesService: PlacesServiceService,
    private menuCtrl: MenuController,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.placesSub = this.placesService.Places.subscribe(places => {
      this.loadedPlaces = places
      this.relaventPlaces = this.loadedPlaces
      this.listedLoadedPlaces = this.relaventPlaces.slice(1)
    })
  }

  ionViewWillEnter() {
    this.isLoading = true
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false
    })
  }

  onOpenMenu() {
    this.menuCtrl.toggle()
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    // console.log(event.detail);
    if (event.detail.value === 'all') { 
      this.relaventPlaces = this.loadedPlaces
      this.listedLoadedPlaces = this.relaventPlaces.slice(1)
    } else {
      this.relaventPlaces = this.loadedPlaces.filter(place => {
        place.userId !== this.authService.userId
      })
      this.listedLoadedPlaces = this.relaventPlaces.slice(1)
    }
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe()
    }
  }

}
