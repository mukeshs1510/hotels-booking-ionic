import { PlaceLocation } from "./location.modal";

export class PlacesModel {
    constructor(
        public id: string, 
        public title: string, 
        public desc: string,
        public imageUrl: string,
        public price: number,
        public availableFrom: Date,
        public availableTo: Date,
        public userId: string,
        public location: PlaceLocation
        ) {}
}