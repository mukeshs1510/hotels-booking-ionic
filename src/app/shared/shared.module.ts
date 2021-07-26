import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MapModalComponent } from "./map-modal/map-modal.component";
import { ImagePickerComponent } from "./pickers/image-picker/image-picker.component";
import { LocationPickersComponent } from "./pickers/location-pickers/location-pickers.component";

@NgModule({
    declarations: [LocationPickersComponent, MapModalComponent, ImagePickerComponent],
    imports: [CommonModule, IonicModule],
    exports: [LocationPickersComponent, MapModalComponent],
    entryComponents: [MapModalComponent]
})
export class SharedModule {}