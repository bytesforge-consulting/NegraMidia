import { NgModule, provideZoneChangeDetection } from '@angular/core';
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
import { AboutItemComponent } from './components/about-item/about-item.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RequestLoadingInterceptor } from './helpers/RequestLoadingInterceptor';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule, CommonModule, RouterOutlet, IMaskModule, FormsModule, ReactiveFormsModule, HttpClientModule, AppRoutingModule
  ],
  declarations: [AppComponent, FooterComponent, NavbarComponent, HeaderComponent, ServicesComponent, AboutComponent, AboutItemComponent, LoadingSpinnerComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: RequestLoadingInterceptor
    },
  ],
  bootstrap: [ AppComponent]
})
export class AppModule { }
