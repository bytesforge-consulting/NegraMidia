import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ServicesComponent } from './components/services/services.component';
import { IMaskModule } from 'angular-imask';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RequestLoadingInterceptor } from './helpers/RequestLoadingInterceptor';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HistoryComponent } from "./components/history/history.component";
import { FloatingIconsComponent } from "./components/floating-icons/floating-icons.component";
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    RouterOutlet,
    IMaskModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerImmediately',
    }),
],
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
    ServicesComponent,
    AboutComponent,
    LoadingSpinnerComponent,
    HistoryComponent,
    FloatingIconsComponent,
    LanguageSelectorComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestLoadingInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi(), withFetch())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
