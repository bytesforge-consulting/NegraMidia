import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(protected spinnerService: SpinnerService) {}
}
