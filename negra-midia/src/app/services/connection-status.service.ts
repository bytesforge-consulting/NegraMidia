import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {

  private connected$: BehaviorSubject<boolean> = new BehaviorSubject(this.isOnline);

  constructor() {
    window.addEventListener('online', () => this.connected$.next(this.isOnline));
    window.addEventListener('offline',() => this.connected$.next(this.isOnline));
  }

  get isOnline(): boolean{
    return window.navigator.onLine;
  }

  get connectionStatus(): Observable<boolean>{
    return this.connected$.asObservable();
  }
}
