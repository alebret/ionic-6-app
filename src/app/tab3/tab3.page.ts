import { Platform } from '@ionic/angular';
import  Echo  from 'src/plugins/Echo';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  private plateform: Platform;

  constructor(plateform: Platform) {
    this.plateform = plateform;
  }

  async callEchoPlugin() {
    if(this.plateform.is("android")){
      // Utilisation du plugin Natie Android
      const { value } = await Echo.echo({ value: 'Hello World!' });
      console.log('Response from native:', value);
    }
    else {
      console.warn("Le plugin ne fonctionne pas sur une autre plateforme qu'Android")
    }
  }
}
