import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './services/spinner-service.service';
import { MetaTranslationService } from './services/meta-translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(
    protected spinnerService: SpinnerService,
    private metaTranslationService: MetaTranslationService
  ) {}

  ngOnInit(): void {
    this.metaTranslationService.updateMetaTags();
    this.metaTranslationService.updateCanonicalUrl();
  }
}
