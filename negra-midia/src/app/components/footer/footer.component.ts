import { ConnectionStatusService } from './../../services/connection-status.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppNotification } from '../../interfaces/notification';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { debounceTime, distinctUntilChanged, first } from 'rxjs';
import { PwaInstalledService } from '../../services/pwa-installed.service';
import { CustomValidators } from '../../helpers/custom-validators';
declare var UIkit: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly notificationOptions = { body: 'Mensagem enviada com sucesso.', icon: '/icons/icon-128x128.png', silent: true, lang: 'pt-BR'};
  private readonly MESSAGE_STOREKEY: string = 'SAVEDMESSAGE';
  private readonly MESSAGE_SENT: string = 'SAVEDMESSAGESENT'

  protected readonly CURRENTYEAR: number = new Date().getFullYear();

  constructor(private httpClient: HttpClient, private connection: ConnectionStatusService, private installedVerifier: PwaInstalledService) {}

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
      UIkit.notification({
        message:
          "<span uk-icon='icon: warning'></span> Parece estar sem conexão, assim que reestabelecida a mensagem será enviada.",
        status: 'primary',
        pos: 'bottom-right',
      });
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
    let messageStored = localStorage.getItem(this.MESSAGE_STOREKEY);
    if (messageStored == undefined || messageStored == null) return;

    let message = JSON.parse(messageStored) as AppNotification;
    this.notification.setValue(message);
  }

  submitContact(){
    let contact = this.notification.value as AppNotification;

    this.httpClient
        .post(`${environment.APIURL}`, contact, {
          responseType: 'text',
        })
        .subscribe({
          next: (res) => {
            this.notify();
            this.notification.reset();
            localStorage.removeItem(this.MESSAGE_STOREKEY);
            localStorage.removeItem(this.MESSAGE_SENT);
          },
          error: (err) =>
            UIkit.notification({
              message:
                "<span uk-icon='icon: warning'></span> Houve um erro ao enviar sua mensagem",
              status: 'danger',
              pos: 'bottom-right',
            }),
        });
  }

  notify() {
    if(!this.installedVerifier.isInstalled()){
      UIkit.notification({
        message:
          "<span uk-icon='icon: check'></span> Mensagem enviada com sucesso.",
        status: 'primary',
        pos: 'bottom-right',
      });

    }
    else if ('Notification' in window && !this.isMobile()){
      if(Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {

          if (permission === 'granted') {
            const notification = new Notification('Notificação - Negra Mídia', this.notificationOptions);
          }
          else if (permission === 'denied') {
            UIkit.notification({
              message:
                "<span uk-icon='icon: check'></span> Mensagem enviada com sucesso.",
              status: 'primary',
              pos: 'bottom-right',
            });
          }
        });
      }
        else if(Notification.permission === 'granted') {
          const notification = new Notification('Notificação - Negra Mídia', this.notificationOptions);
        }
    }
    else {
      UIkit.notification({
        message:
          "<span uk-icon='icon: check'></span> Mensagem enviada com sucesso.",
        status: 'primary',
        pos: 'bottom-right',
      });
    }
  }

  getFormValidationClass(formName: string) : string{
    let form = this.notification.get(formName);
    if(form?.pristine)
      return '';
    return form?.valid ? 'success' : 'error'
  }

  isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }
}
