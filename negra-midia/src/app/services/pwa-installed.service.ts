import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PwaInstalledService {
  constructor() {}

  isInstalled(): boolean {
    const nav: any = window.navigator;

    if (nav.standalone) return true;

    if (window.matchMedia('(display-mode: standalone)').matches) return true;

    let result: boolean = false;
    if ('getInstalledRelatedApps' in nav) {
      nav.getInstalledRelatedApps().then((apps: any[]) => {
        result = apps.length > 0;
      });
    }
    return result;
  }
}
