import { HttpClient } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/place/location.modal';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-pickers',
  templateUrl: './location-pickers.component.html',
  styleUrls: ['./location-pickers.component.scss'],
})
export class LocationPickersComponent implements OnInit {

  @Output locationPick = new EventEmitter<PlaceLocation>();
  isLoading = false
  selectedLocationImgUrl: string

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient
  ) { }

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modal => {
      modal.onDidDismiss().then(modalData => {
        if(!modalData) {
          return;
        } 
        const pickedAddress: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImgUrl: null,
        }
        this.isLoading = true
        this.getAddress(modalData.data.lat, modalData.data.lng)
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
      })
      modal.present()
    })
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>('geocoding api //224').pipe(map(geoData => {
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
