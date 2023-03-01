import { Component } from '@angular/core';
import { BatteryInfo, Device, DeviceInfo } from '@capacitor/device';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public deviceInfos: DeviceInfo | undefined;
  public deviceBattery!: BatteryInfo;

  constructor() {}

  async ngOnInit() {
    this.deviceInfos = await Device.getInfo()
    this.deviceBattery = await Device.getBatteryInfo()
  }
}
