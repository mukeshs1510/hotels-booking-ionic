import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Coordinates, PlaceLocation } from 'src/app/place/location.modal';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { Plugins, Capacitor } from '@capacitor/core'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-location-pickers',
  templateUrl: './location-pickers.component.html',
  styleUrls: ['./location-pickers.component.scss'],
})
export class LocationPickersComponent implements OnInit {

  @Output() locationPick = new EventEmitter<PlaceLocation>();
  isLoading = false
  selectedLocationImgUrl: string

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheet: ActionSheetController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}

  onPickLocation() {
    this.actionSheet.create({
      header: 'Please Choose', 
      buttons: [
        {
          text: 'Auto-locate', handler: () => {
            this.locateUser()
          },
        },
        {
          text: 'Pick on Map', handler: () => {
            this.openMap()
          },
        },
        {
          text: 'Cancel', role: 'cancel',
        }
      ]
    }).then(act => {
      act.present()
    })
  }

  private locateUser() {
    if(!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert()
      return;
    } else {
      this.isLoading = true
      Plugins.Geolocation.getCurrentPosition()
      .then(geoPos => {
        const coordinates: Coordinates = {lat: geoPos.coords.latitude, lng: geoPos.coords.longitude}
        this.createPlace(coordinates.lat, coordinates.lng)
        this.isLoading = false
      })
      .catch(err => {
        this.isLoading = false
        this.showErrorAlert()
      })
    }
  }

  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location',
      buttons: ['Ok']
    }).then(al => al.present())
  }

  private openMap() {
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modal => {
      modal.onDidDismiss().then(modalData => {
        if(!modalData) {
          return;
        } 
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
        }

        this.createPlace(coordinates.lat, coordinates.lng)
        
      })
      modal.present()
    })
  }

  private createPlace(lat: number, lng: number) {

    const pickedAddress: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImgUrl: null,
    }

    this.isLoading = true
        this.getAddress(lat, lng)
        .pipe(switchMap(address => {
          pickedAddress.address = address;
          return of(this.getMapImg(
              pickedAddress.lat,
              pickedAddress.lng,
              14
            ))
        })).subscribe(staticMapImgUrl => {
          pickedAddress.staticMapImgUrl = staticMapImgUrl;
          this.selectedLocationImgUrl = staticMapImgUrl
          this.isLoading = false
          this.locationPick.emit(pickedAddress)
        })
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>('https://www.google.com/maps/embed/v1/MAP_MODE?key='+environment.googleApiKey+'&PARAMETERS').pipe(map(geoData => {
      if(!geoData || !geoData.results || geoData.result.length === 0) {
        return null;
      }
      return geoData.results[0].formatted_address;
    }));
  }

  private getMapImg(lat: number, lng: number, zoom: number) {
    return "map img url //225";
  }

}
