import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppNotification } from '../../interfaces/notification';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs';
declare var UIkit: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private httpClient: HttpClient) {}

  protected readonly CURRENTYEAR: number = new Date().getFullYear();
  private  readonly MESSAGE_STOREKEY: string = 'SAVEDMESSAGE';

  notification = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('\(\d{2}\)\d{4,5}-\d{4}')]),
    body: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required])
  });

  onContactSubmit(){
    let contact = this.notification.value as AppNotification;

    this.httpClient.post(`${environment.APIURL}/notify`, contact, {
      responseType: 'text'
    })
    .subscribe({
      next: res =>{
        UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Mensagem enviada com sucesso.', status: 'primary', pos: 'bottom-right'});
        this.notification.reset();
        localStorage.removeItem(this.MESSAGE_STOREKEY);
      },
      error: err => UIkit.notification({message: '<span uk-icon=\'icon: warning\'></span> Houve um erro ao enviar sua mensagem', status: 'danger', pos: 'bottom-right'})
    });
  }

  onContactFieldChanged(){
    localStorage.setItem(this.MESSAGE_STOREKEY, JSON.stringify(this.notification.value));
  }

  ngOnInit() {
    this.LoadExistingContactForm();
    this.notification.valueChanges.
      pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => this.onContactFieldChanged())
  }

  LoadExistingContactForm(){
    let messageStored = localStorage.getItem(this.MESSAGE_STOREKEY);
    if(messageStored == undefined || messageStored == null)
      return;

    let message = JSON.parse(messageStored) as AppNotification;
    this.notification.setValue(message);
  }
}
