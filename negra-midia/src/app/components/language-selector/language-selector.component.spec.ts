import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LanguageSelectorComponent } from './language-selector.component';
import { Subject } from 'rxjs';

// Mock window object
const mockWindow = {
  location: {
    pathname: '/pt/',
    origin: 'https://example.com'
  },
  innerWidth: 1200,
  matchMedia: jest.fn().mockReturnValue({ matches: false }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

// Mock document object
const mockDocument = {
  querySelector: jest.fn(),
  createElement: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
};

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockLocation: jest.Mocked<Location>;
  let originalWindow: any;
  let originalDocument: any;

  beforeEach(async () => {
    // Save originals
    originalWindow = global.window;
    originalDocument = global.document;

    // Mock global objects
    (global as any).window = mockWindow;
    (global as any).document = mockDocument;

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
    // Clean up timers
    if (component['hideTimeout']) {
      clearTimeout(component['hideTimeout']);
    }
    
    // Restore originals
    (global as any).window = originalWindow;
    (global as any).document = originalDocument;
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

  it('should detect Portuguese as default language', () => {
    mockLocation.path.mockReturnValue('/');
    mockWindow.location.pathname = '/';
    
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

  it('should detect language from window.location.pathname', () => {
    mockLocation.path.mockReturnValue('/');
    mockWindow.location.pathname = '/en/';
    
    component.detectCurrentLanguage();
    expect(component.currentLanguage).toBe('en');
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

  it('should toggle mobile dropdown correctly for mobile devices', () => {
    // Mock mobile device
    mockWindow.innerWidth = 500;

    const event = new MouseEvent('click');
    jest.spyOn(event, 'stopPropagation');

    component.toggleMobileDropdown(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.isActive).toBe(true);
    expect(component.menuOpen).toBe(true);
    expect(component.isVisible).toBe(true);
  });

  it('should toggle mobile dropdown correctly for desktop devices', () => {
    // Mock desktop device
    mockWindow.innerWidth = 1200;

    const event = new MouseEvent('click');
    jest.spyOn(event, 'stopPropagation');

    component.toggleMobileDropdown(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.menuOpen).toBe(true);
    expect(component.isVisible).toBe(true);
  });

  it('should keep menu open when hovering', () => {
    const event = new MouseEvent('mouseenter');
    jest.spyOn(event, 'stopPropagation');

    component.keepMenuOpen(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.menuOpen).toBe(true);
    expect(component.isVisible).toBe(true);
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

  it('should handle click outside to close menu', () => {
    component.isActive = true;
    component.menuOpen = true;

    const mockElement = document.createElement('div');
    const event = {
      target: mockElement
    } as any;

    // Mock closest to return null (click outside)
    jest.spyOn(mockElement, 'closest').mockReturnValue(null);

    component.clickOutside(event);

    expect(component.isActive).toBe(false);
    expect(component.menuOpen).toBe(false);
  });

  it('should not close menu when clicking inside', () => {
    component.isActive = true;
    component.menuOpen = true;

    const mockElement = document.createElement('div');
    const event = {
      target: mockElement
    } as any;

    // Mock closest to return element (click inside)
    jest.spyOn(mockElement, 'closest').mockReturnValue(document.createElement('div'));

    component.clickOutside(event);

    expect(component.isActive).toBe(true);
    expect(component.menuOpen).toBe(true);
  });

  it('should handle mouse leave', () => {
    component.menuOpen = true;
    const event = new MouseEvent('mouseleave');

    component.onMouseLeave(event);

    expect(component.menuOpen).toBe(false);
  });

  it('should handle window scroll', () => {
    jest.spyOn(component['scrollSubject'], 'next');
    
    component.onWindowScroll();
    
    expect(component['scrollSubject'].next).toHaveBeenCalled();
  });

  it('should start and clear hide timeout', fakeAsync(() => {
    component.startHideTimeout();
    expect(component['hideTimeout']).toBeDefined();
    
    // Fast forward time
    tick(4100);
    expect(component.isVisible).toBe(false);
  }));

  it('should reset hide timeout', () => {
    component['hideTimeout'] = setTimeout(() => {}, 1000);
    
    component.resetHideTimeout();
    
    expect(component['hideTimeout']).toBe(undefined);
  });

  it('should handle ngOnInit correctly', fakeAsync(() => {
    jest.spyOn(component, 'detectCurrentLanguage');
    jest.spyOn(component, 'startHideTimeout');
    
    component.ngOnInit();
    
    expect(component.detectCurrentLanguage).toHaveBeenCalled();
    expect(component.startHideTimeout).toHaveBeenCalled();
    
    // Test scroll debounce
    component.onWindowScroll();
    component.onWindowScroll();
    component.onWindowScroll();
    
    tick(250); // Wait for debounce
    
    // Should have called showSelector and startHideTimeout
    expect(component.isVisible).toBe(true);
  }));

  it('should clean up on destroy', () => {
    component['hideTimeout'] = setTimeout(() => {}, 1000);
    jest.spyOn(component['destroy$'], 'next');
    jest.spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should handle base element language detection', () => {
    mockLocation.path.mockReturnValue('/');
    mockWindow.location.pathname = '/';
    
    // Mock document.querySelector to return base element
    const mockBaseElement = {
      getAttribute: jest.fn().mockReturnValue('/en/')
    };
    mockDocument.querySelector.mockReturnValue(mockBaseElement);
    
    component.detectCurrentLanguage();
    expect(component.currentLanguage).toBe('en');
  });
});