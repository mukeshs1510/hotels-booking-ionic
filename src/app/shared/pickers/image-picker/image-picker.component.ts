import { Component, OnInit } from '@angular/core';
import { Plugins, Capacitor } from "@capacitor/core";

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  selectedImg: string

  constructor() { }

  ngOnInit() {}

  onPickImg() {
    // if(!Capacitor.isPluginAvailable('Camera')) {
    //   return;
    // } else {
    //   Plugins.Camera.getPhoto({
    //     quality: 50,
    //     source: CameraSource.Prompt,
        
    //   })
    // }
    // plugin is deprecated!
  }

}
