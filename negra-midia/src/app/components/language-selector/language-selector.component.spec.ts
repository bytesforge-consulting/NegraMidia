import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LanguageSelectorComponent } from './language-selector.component';
import { Subject } from 'rxjs';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockLocation: jest.Mocked<Location>;

  beforeEach(async () => {
    // Create mocks
    mockRouter = {
      navigate: jest.fn(),
      url: '/pt',
      events: new Subject()
    } as any;

    mockLocation = {
      path: jest.fn().mockReturnValue('/pt'),
      go: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      replaceState: jest.fn(),
      getState: jest.fn(),
      isCurrentPathEqualTo: jest.fn(),
      normalize: jest.fn(),
      prepareExternalUrl: jest.fn(),
      subscribe: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Clean up timers safely
    if (component && component['hideTimeout']) {
      clearTimeout(component['hideTimeout']);
    }
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentLanguage).toBe('pt');
    expect(component.isActive).toBe(false);
    expect(component.menuOpen).toBe(false);
    expect(component.isVisible).toBe(true);
  });

  it('should return correct flag for each language', () => {
    component.currentLanguage = 'en';
    expect(component.getCurrentLanguageFlag()).toBe('flags/us.svg');
    
    component.currentLanguage = 'es';
    expect(component.getCurrentLanguageFlag()).toBe('flags/es.svg');
    
    component.currentLanguage = 'pt';
    expect(component.getCurrentLanguageFlag()).toBe('flags/br.svg');
    
    component.currentLanguage = 'invalid';
    expect(component.getCurrentLanguageFlag()).toBe('flags/br.svg');
  });

  it('should detect Portuguese as default language', () => {
    mockLocation.path.mockReturnValue('/');
    component.detectCurrentLanguage();
    expect(component.currentLanguage).toBe('pt');
  });

  it('should detect English language from path', () => {
    mockLocation.path.mockReturnValue('/en/about');
    component.detectCurrentLanguage();
    expect(component.currentLanguage).toBe('en');
  });

  it('should detect Spanish language from path', () => {
    mockLocation.path.mockReturnValue('/es/contact');
    component.detectCurrentLanguage();
    expect(component.currentLanguage).toBe('es');
  });

  it('should show selector', () => {
    component.isVisible = false;
    component.showSelector();
    expect(component.isVisible).toBe(true);
  });

  it('should hide selector', () => {
    component.isVisible = true;
    component.hideSelector();
    expect(component.isVisible).toBe(false);
  });

  it('should handle window scroll', () => {
    jest.spyOn(component['scrollSubject'], 'next');
    component.onWindowScroll();
    expect(component['scrollSubject'].next).toHaveBeenCalled();
  });

  it('should reset hide timeout', () => {
    // Set up a timeout first
    component['hideTimeout'] = setTimeout(() => {}, 1000) as any;
    
    // Call the reset method
    component.resetHideTimeout();
    
    // The timeout should be cleared (may be undefined or null)
    expect(component['hideTimeout']).toBeFalsy();
  });

  it('should clean up on destroy', () => {
    component['hideTimeout'] = setTimeout(() => {}, 1000);
    jest.spyOn(component['destroy$'], 'next');
    jest.spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});