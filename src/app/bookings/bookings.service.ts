import { formatCurrency } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { delay, map, switchMap, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/service/auth.service";
import { BookingsModel } from "./bookings.model";

interface BookingData{
dateFrom: string;
dateTo:  string;
firstName:  string;
lastName:  string;
guestNumber:  number;
placeId:  string;
placeImage:  string;
placeTitle:  string;
userId:  string;
}

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private _bookings = new BehaviorSubject<BookingsModel[]>([

    ]) 

    constructor(
        public authSerice: AuthService,
        private http: HttpClient
        ) {}

    get bookings() {
        return this._bookings.asObservable()
    }

    addBooking(
        placeId: string, placeTitle: string, placeImg: string,
        firstName: string, lastName: string, guestNumber: number,
        dateFrom: Date, dateTo: Date) {
            let genId: string
            let newBooking: BookingsModel
            return this.authSerice.userId.pipe(take(1), switchMap(userId => {
                if(!userId) {
                    throw new Error("No user id found!")
                } else {
                    newBooking = new BookingsModel(
                        Math.random().toString(),
                        placeId,
                        userId,
                        placeTitle,
                        placeImg,
                        firstName,
                        lastName,
                        guestNumber,
                        dateFrom,
                        dateTo
                    );
                    return this.http.post<{name: string}>(
                        "https://udemy-ionicc-default-rtdb.firebaseio.com/bookings.json",
                        { ...newBooking, id: null }
                    )
                }
            }), switchMap((resData) => {
                genId = resData.name
                return this.bookings
            }), 
            take(1),
            tap(bookings => {
                newBooking.id = genId
                this._bookings.next(bookings.concat(newBooking))
            }))
        }

    cancelBooking(bookingId: string) {
        return this.http.delete(`https://udemy-ionicc-default-rtdb.firebaseio.com/bookings/${bookingId}.json`)
        .pipe(switchMap(() => {
            return this.bookings
        }),
        take(1),
        tap(bookings => {
            this._bookings.next(bookings.filter(b => {
                b.id !== bookingId
            }))
        })
        )

    }

    fetchBookings() {
        return this.authSerice.userId.pipe(switchMap(userId => {
            if (!userId) { 
                throw new Error("User not found!")
            } else {
            return this.http.get<{[key: string]: BookingData}>(
                `https://udemy-ionicc-default-rtdb.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${userId}"`
            )
        }
        }), map(bookingData => {
            const booking = [];
            for(const key in bookingData) {
                if(bookingData.hasOwnProperty(key)) {
                    booking.push(new BookingsModel(
                        key,
                        bookingData[key].placeId,
                        bookingData[key].userId,
                        bookingData[key].placeTitle,
                        bookingData[key].placeImage,
                        bookingData[key].firstName,
                        bookingData[key].lastName,
                        bookingData[key].guestNumber,
                        new Date(bookingData[key].dateFrom),
                        new Date(bookingData[key].dateTo),
                    ))
                }
            }
            return booking
        }),
        tap(booking => {
            this._bookings.next(booking)
    })
        )
    }

}


// return this.bookings.pipe(take(1),
//             delay(1000),
//              tap((bookings) => {
//                 this._bookings.next(bookings.concat(newBooking))
//             }))