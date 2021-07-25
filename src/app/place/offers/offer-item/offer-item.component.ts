import { Component, Input, OnInit } from '@angular/core';
import { PlacesModel } from '../../places.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {

  @Input() offer: PlacesModel

  constructor() { }

  ngOnInit() {}

  // getDummyDate() {
  //   return new Date()
  // }

}
