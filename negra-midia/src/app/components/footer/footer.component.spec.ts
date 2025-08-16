import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer.component';
import { ConnectionStatusService } from '../../services/connection-status.service';
import { PwaInstalledService } from '../../services/pwa-installed.service';
import { BehaviorSubject } from 'rxjs';

// Simple UIkit mock - will be set up in beforeEach

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let httpTestingController: HttpTestingController;
  let mockConnectionService: any;
  let mockPwaService: jest.Mocked<PwaInstalledService>;
  let connectionSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    // Create fresh UIkit mock for each test
    const mockUIkit = {
      notification: jest.fn()
    };
    
    // Safely set up UIkit mock
    if (!(globalThis as any).UIkit) {
      Object.defineProperty(globalThis, 'UIkit', {
        value: mockUIkit,
        writable: true,
        configurable: true
      });
    } else {
      // Reset existing UIkit mock
      (globalThis as any).UIkit.notification = jest.fn();
    }

    // Mock services
    connectionSubject = new BehaviorSubject(true);
    mockConnectionService = {
      get isOnline() { return true; },
      connectionStatus: connectionSubject.asObservable()
    };

    mockPwaService = {
      isInstalled: jest.fn().mockReturnValue(false)
    } as any;

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ConnectionStatusService, useValue: mockConnectionService },
        { provide: PwaInstalledService, useValue: mockPwaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });

  afterEach(() => {
    if (httpTestingController) {
      httpTestingController.verify();
    }
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required validators', () => {
    fixture.detectChanges();
    
    expect(component.notification.get('name')?.hasError('required')).toBe(true);
    expect(component.notification.get('email')?.hasError('required')).toBe(true);
    expect(component.notification.get('body')?.hasError('required')).toBe(true);
    expect(component.notification.get('subject')?.hasError('required')).toBe(true);
  });

  it('should have current year defined', () => {
    const currentYear = new Date().getFullYear();
    expect(component['CURRENTYEAR']).toBe(currentYear);
  });

  it('should load existing form data from localStorage', () => {
    const savedData = {
      name: 'Saved User',
      email: 'saved@example.com',
      subject: 'Saved Subject',
      body: 'Saved message',
      phone: ''
    };

    (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(savedData));
    
    component.LoadExistingContactForm();

    expect(component.notification.value).toEqual(savedData);
  });

  it('should handle no existing form data', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    expect(() => component.LoadExistingContactForm()).not.toThrow();
  });

  it('should handle form validation classes', () => {
    const nameControl = component.notification.get('name');
    
    // Pristine state
    expect(component.getFormValidationClass('name')).toBe('');
    
    // Mark as touched and invalid
    nameControl?.markAsTouched();
    nameControl?.setValue('');
    nameControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.getFormValidationClass('name')).toBe('error');
    
    // Valid state
    nameControl?.setValue('Valid Name');
    nameControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.getFormValidationClass('name')).toBe('');
  });

  it('should detect mobile devices correctly', () => {
    // Mock mobile user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
      configurable: true
    });
    
    expect(component.isMobile()).toBe(true);
    
    // Mock desktop user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true
    });
    
    expect(component.isMobile()).toBe(false);
  });

  it('should show UIkit notification for non-PWA users', () => {
    mockPwaService.isInstalled.mockReturnValue(false);
    
    component.notify();
    
    expect((globalThis as any).UIkit.notification).toHaveBeenCalledWith({
      message: "<span uk-icon='icon: check'></span> Mensagem enviada com sucesso.",
      status: 'primary',
      pos: 'bottom-right'
    });
  });

  it('should handle phone field validation', () => {
    const phoneControl = component.notification.get('phone');
    
    // Valid phone format
    phoneControl?.setValue('(11)99999-9999');
    expect(phoneControl?.valid).toBe(true);
    
    // Empty phone (should be valid due to PatternIfNotNull)
    phoneControl?.setValue('');
    expect(phoneControl?.valid).toBe(true);
  });
});