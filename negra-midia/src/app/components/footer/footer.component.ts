import { ConnectionStatusService } from './../../services/connection-status.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppNotification } from '../../interfaces/notification';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PwaInstalledService } from '../../services/pwa-installed.service';
import { CustomValidators } from '../../helpers/custom-validators';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  private readonly MESSAGE_STOREKEY: string = 'SAVEDMESSAGE';
  private readonly MESSAGE_SENT: string = 'SAVEDMESSAGESENT'

  protected readonly CURRENTYEAR: number = new Date().getFullYear();

  constructor(
    private httpClient: HttpClient,
    private connection: ConnectionStatusService,
    private installedVerifier: PwaInstalledService,
    private notificationService: NotificationService
  ) {}

  notification = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [CustomValidators.PatternIfNotNull('(d{2})d{4,5}-d{4}')]),
    body: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
  });

  onContactSubmit() {
    if(this.connection.isOnline){
      this.submitContact();
    }
    else{
      localStorage.setItem(this.MESSAGE_SENT, '1');
      this.notificationService.showOfflineNotification();
    }
  }

  onContactFieldChanged() {
    localStorage.setItem(
      this.MESSAGE_STOREKEY,
      JSON.stringify(this.notification.value)
    );
  }

  ngOnInit() {
    this.LoadExistingContactForm();

    this.notification.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => this.onContactFieldChanged());

    this.connection.connectionStatus
      .subscribe(connected => {
        if( localStorage.getItem(this.MESSAGE_SENT) === '1' && this.notification.valid && connected){
          this.submitContact();
        }
      });
  }

  LoadExistingContactForm() {
    const messageStored = localStorage.getItem(this.MESSAGE_STOREKEY);
    if (messageStored == undefined || messageStored == null) return;

    const message = JSON.parse(messageStored) as AppNotification;
    this.notification.setValue(message);
  }

  submitContact(){
    const contact = this.notification.value as AppNotification;

    // Basic Auth credentials from environment variables
    const username = environment.API_USER;
    const password = environment.API_PASSWORD;
    const credentials = btoa(`${username}:${password}`);

    this.httpClient
        .post(`${environment.APIURL}/notifications`, contact, {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
          responseType: 'json',
        })
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              this.notify();
              this.notification.reset();
              localStorage.removeItem(this.MESSAGE_STOREKEY);
              localStorage.removeItem(this.MESSAGE_SENT);
            } else {
              this.handleError(response.error);
            }
          },
          error: (error) => {
            this.handleError(error.error || 'Erro desconhecido ao enviar mensagem');
          },
        });
  }

  private handleError(error: any) {
    this.notificationService.showValidationError(error);
  }

  async notify() {
    if(!this.installedVerifier.isInstalled()){
      this.notificationService.showSuccess();
    }
    else if (this.notificationService.isNotificationSupported() && !this.isMobile()){
      if(Notification.permission === 'default') {
        const permissionGranted = await this.notificationService.requestNotificationPermission();

        if (permissionGranted) {
          this.notificationService.showBrowserNotification('notification.title', 'notification.success');
        } else {
          this.notificationService.showSuccess();
        }
      }
      else if(this.notificationService.isNotificationPermissionGranted()) {
        this.notificationService.showBrowserNotification('notification.title', 'notification.success');
      }
    }
    else {
      this.notificationService.showSuccess();
    }
  }

  getFormValidationClass(formName: string) : string{
    const form = this.notification.get(formName);
    if(form?.pristine)
      return '';
    return form?.valid ? 'success' : 'error'
  }

  isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }
}
