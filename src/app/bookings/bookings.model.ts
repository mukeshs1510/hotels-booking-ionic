export class BookingsModel{
    constructor(
        public id: string,
        public placeId: string,
        public userId: string,
        public placeTitle: string,
        public placeImage: string,
        public firstName: string,
        public lastName: string,
        public guestNumber: number,
        public dateFrom: Date,
        public dateTo: Date,
        ) {}
}