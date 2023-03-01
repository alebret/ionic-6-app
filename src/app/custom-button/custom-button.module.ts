import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomButtonComponent } from './custom-button.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [CustomButtonComponent],
  exports: [CustomButtonComponent]
})
export class CustomButtonComponentModule {}
