import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElmtRef: ElementRef
  clickListener: any
  googleMap: any

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
      this.googleMap = googleMaps
        const mapEl = this.mapElmtRef.nativeElement
        const map = new googleMaps.maps(mapEl, {
          center: {lat: -34.345, lng: 124.432},
          zoom: 14
        });
        this.googleMap.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible')
        });
        this.clickListener = map.addListener('click',(event) => {
          const selectedCoords = {
            lat: event.latLng.lat(), 
            lng:event.latLng.lng()
          }
          this.modalCtrl.dismiss(selectedCoords)
        })

      }
    ).catch(err => {
      console.log(err);
    })
  }

  onCancel() {
    this.modalCtrl.dismiss()
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if(googleModule && googleModule.maps)  {
      return Promise.resolve(googleModule.maps)
    }
    return new Promise((resolve, reject) => {
      const sc = document.createElement('script');
      sc.src = 'https://maps.google.com/maps/api/js?key=AIzaSyAFdqSO5ITcCmFlj5KV9Cs6MrA4dl8aNqE'
      sc.async = true;
      sc.defer = true;
      document.body.appendChild(sc)
      sc.onload = () => {
        const loadedGoogleModule = win.google
        if(loadedGoogleModule && loadedGoogleModule.maps)  {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps sdk not available!')
        }
      }
    })
  }

  ngOnDestroy() {
    this.googleMap.event.removeListener(this.clickListener)
  }

}
