import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-language-selector',
  standalone: false,
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  currentLanguage: string = 'pt';
  isActive: boolean = false;
  menuOpen: boolean = false;
  isVisible: boolean = true;
  private hideTimeout: any;
  private scrollSubject = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private location: Location) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.language-selector')) {
      this.isActive = false;
      this.menuOpen = false;
    }
  }



  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: Event) {
    this.menuOpen = false;
    this.startHideTimeout();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrollSubject.next();
  }

  ngOnInit(): void {
    this.detectCurrentLanguage();

    // Configura o Subject para detectar rolagem com debounce
    this.scrollSubject.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showSelector();
      this.startHideTimeout();
    });

    // Inicia o temporizador para ocultar o seletor após 4 segundos
    this.startHideTimeout();
  }

  ngOnDestroy(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  detectCurrentLanguage(): void {
    // Fontes de informação para detectar o idioma em ordem de prioridade
    const path = this.location.path();
    const currentUrl = window.location.pathname;
    const baseElement = document.querySelector('base');
    const baseHref = baseElement?.getAttribute('href') || '';
    
    // Verifica cada fonte em ordem de prioridade
    if (this.containsLanguageCode(path, 'en')) {
      this.currentLanguage = 'en';
    } else if (this.containsLanguageCode(path, 'es')) {
      this.currentLanguage = 'es';
    } else if (this.containsLanguageCode(currentUrl, 'en')) {
      this.currentLanguage = 'en';
    } else if (this.containsLanguageCode(currentUrl, 'es')) {
      this.currentLanguage = 'es';
    } else if (this.containsLanguageCode(baseHref, 'en')) {
      this.currentLanguage = 'en';
    } else if (this.containsLanguageCode(baseHref, 'es')) {
      this.currentLanguage = 'es';
    } else {
      // Fallback para pt
      this.currentLanguage = 'pt';
    }

    console.log('Detected language:', this.currentLanguage);
  }

  // Método auxiliar para verificar se uma string contém um código de idioma
  private containsLanguageCode(text: string, code: string): boolean {
    return text.includes(`/${code}`);
  }

  getCurrentLanguageFlag(): string {
    switch(this.currentLanguage) {
      case 'en': return 'flags/us.svg';
      case 'es': return 'flags/es.svg';
      default: return 'flags/br.svg';
    }
  }

  toggleMobileDropdown(event: MouseEvent): void {
    event.stopPropagation();

    // Para dispositivos móveis
    if (window.innerWidth <= 640) {
      this.isActive = !this.isActive;
      this.menuOpen = this.isActive; // Sincroniza menuOpen com isActive no mobile
    } else {
      // Para desktop - apenas alterna o estado do menu
      this.menuOpen = !this.menuOpen;
    }

    this.showSelector();
    this.resetHideTimeout();
  }

  // Keep menu open when hovering or interacting with options
  keepMenuOpen(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen = true;
    this.showSelector();
    this.resetHideTimeout();
  }

  // Mostra o seletor de idioma
  showSelector(): void {
    this.isVisible = true;
  }

  // Oculta o seletor de idioma
  hideSelector(): void {
    this.isVisible = false;
  }

  // Inicia o temporizador para ocultar o seletor
  startHideTimeout(): void {
    this.resetHideTimeout();
    this.hideTimeout = setTimeout(() => {
      this.hideSelector();
    }, 4000);
  }

  // Reseta o temporizador de ocultação
  resetHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}
