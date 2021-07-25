import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { PlacesModel } from '../places.model';
import { take, map, tap, delay, switchMap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from '../location.modal';

interface PlaceData {
  availableFrom: string,
availableTo: string,
desc: string,
imageUrl: string,
price: number,
title: string,
userId: string,
location: PlaceLocation
}

@Injectable({
  providedIn: 'root'
})
export class PlacesServiceService {

  private _places = new BehaviorSubject<PlacesModel[]>([]);
  
  get Places() {
    return this._places.asObservable()
  }

  constructor(private authService: AuthService,
    private http: HttpClient
    ) { }

  getPlace(id: string) {
    return this.http
    .get<PlaceData>(
      `https://udemy-ionicc-default-rtdb.firebaseio.com/offers-places/${id}.json`
      ).pipe(
        map(placeData => {
          return new PlacesModel(id,
            placeData.title,
            placeData.desc,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId,
            placeData.location
            )
        })
      )
    
  }

  addPlace(title: string, desc: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {
    let gereratedId: string;
    const newPlace = new PlacesModel(
      Math.random().toString(),title, desc, 'https://www.planetware.com/wpimages/2020/01/india-in-pictures-beautiful-places-to-photograph-kapaleeshwarar-temple.jpg',price,dateFrom, 
      dateTo, this.authService.userId, location);
      
      return this.http.post<{name: string}>("https://udemy-ionicc-default-rtdb.firebaseio.com/offers-places.json", { ...newPlace, id: null })
      .pipe(
        switchMap(resData => {
          gereratedId = resData.name
          return this.Places
        }),
        take(1),
        tap((places) => {
          newPlace.id = gereratedId
              this._places.next(places.concat(newPlace))
          })
      )
  }

  fetchPlaces() {
    return this.http.get<{[key: string]: PlaceData}>("https://udemy-ionicc-default-rtdb.firebaseio.com/offers-places.json")
    .pipe(map(resData => {
      const places = []
      for(const key in resData) {
        if(resData.hasOwnProperty(key)) {
          places.push(new PlacesModel(
            key,
            resData[key].title,
            resData[key].desc,
            resData[key].imageUrl,
            resData[key].price,
            new Date(resData[key].availableFrom),
            new Date(resData[key].availableTo),
            resData[key].userId,
            resData[key].location
          ))
        }
      }
      return places
    }),
    tap(res => {
      this._places.next(res)
    })
    )
  }

  updatePlace(placeId: string, title: string, desc: string) {

    let updatedPlaces: PlacesModel[];

    return this.Places.pipe(take(1),
     switchMap(places => {
       if(!places || places.length <= 0) {
         return this.fetchPlaces()
       } else {
         return of(places)
       }
    }),
    switchMap((places) => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      updatedPlaces = [...places]
      const oldPlace = updatedPlaces[updatedPlaceIndex]
      updatedPlaces[updatedPlaceIndex] = new PlacesModel(
        oldPlace.id,
        title,
        desc,
        oldPlace.imageUrl,
        oldPlace.price, 
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId,
        oldPlace.location
      );
      return this.http.put(`https://udemy-ionicc-default-rtdb.firebaseio.com/offers-places/${placeId}.json`,
      { ...updatedPlaces[updatedPlaceIndex], id: null });
    }),
    tap(() => {
      this._places.next(updatedPlaces)
    }))
  }
}



// new PlacesModel('p1', 'Manhattan Mansion',
// 'In the heart of New York City',
//  'https://www.planetware.com/wpimages/2020/01/india-in-pictures-beautiful-places-to-photograph-kapaleeshwarar-temple.jpg',
//   399,
//   new Date('2019-01-01'),
//   new Date('2019-12-31'),
//   'abc'
//   ),
//   new PlacesModel('p2', 'L\'Amour Toujours',
// 'A Romantic place in paris!',
//  'https://www.planetware.com/wpimages/2020/01/india-in-pictures-beautiful-places-to-photograph-gateway-of-india-mumbai.jpg',
//   199.99,
//   new Date('2019-01-01'),
//   new Date('2019-12-31'),
//   'abc'
//   ),
//   new PlacesModel('p3', 'The Foggy Palace',
// 'Not your average city trip!',
//  'https://www.planetware.com/wpimages/2020/01/india-in-pictures-beautiful-places-to-photograph-bada-bagh-jaisalmer.jpg',
//   299,
//   new Date('2019-01-01'),
//   new Date('2019-12-31'),
//   'abc'
//   )
