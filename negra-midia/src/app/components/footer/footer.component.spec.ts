import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer.component';
import { ConnectionStatusService } from '../../services/connection-status.service';
import { PwaInstalledService } from '../../services/pwa-installed.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

// Mock UIkit globally
declare global {
  var UIkit: any;
}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let httpTestingController: HttpTestingController;
  let mockConnectionService: any;
  let mockPwaService: jest.Mocked<PwaInstalledService>;
  let mockUIkit: any;
  let connectionSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    // Mock UIkit
    mockUIkit = {
      notification: jest.fn()
    };
    globalThis.UIkit = mockUIkit;

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
    httpTestingController.verify();
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

  it('should submit contact when online', () => {
    // Set form values
    component.notification.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test message',
      phone: '(11)99999-9999'
    });

    Object.defineProperty(mockConnectionService, 'isOnline', {
      value: true,
      configurable: true
    });
    
    component.onContactSubmit();

    const req = httpTestingController.expectOne(environment.APIURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test message',
      phone: '(11)99999-9999'
    });

    req.flush('Success');
  });

  it('should store message when offline', () => {
    Object.defineProperty(mockConnectionService, 'isOnline', {
      value: false,
      configurable: true
    });
    
    component.onContactSubmit();

    expect(localStorage.setItem).toHaveBeenCalledWith('SAVEDMESSAGESENT', '1');
    expect(mockUIkit.notification).toHaveBeenCalledWith({
      message: "<span uk-icon='icon: warning'></span> Parece estar sem conexão, assim que reestabelecida a mensagem será enviada.",
      status: 'primary',
      pos: 'bottom-right'
    });
  });

  it('should save form changes to localStorage', fakeAsync(() => {
    fixture.detectChanges();
    
    component.notification.patchValue({
      name: 'Test User',
      email: 'test@example.com'
    });

    tick(1100); // Wait for debounce

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'SAVEDMESSAGE',
      JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: null,
        body: null,
        phone: null
      })
    );
  }));

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

  it('should submit pending message when connection restored', fakeAsync(() => {
    // Set up valid form
    component.notification.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test message'
    });

    // Mock localStorage to indicate message was saved when offline
    (localStorage.getItem as jest.Mock).mockReturnValue('1');

    fixture.detectChanges();

    // Simulate connection restored
    connectionSubject.next(true);
    tick();

    const req = httpTestingController.expectOne(environment.APIURL);
    expect(req.request.method).toBe('POST');
    req.flush('Success');
  }));

  it('should handle form validation classes', () => {
    const nameControl = component.notification.get('name');
    
    // Pristine state
    expect(component.getFormValidationClass('name')).toBe('');
    
    // Mark as touched and invalid
    nameControl?.markAsTouched();
    nameControl?.setValue('');
    expect(component.getFormValidationClass('name')).toBe('error');
    
    // Valid state
    nameControl?.setValue('Valid Name');
    expect(component.getFormValidationClass('name')).toBe('success');
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
    
    expect(mockUIkit.notification).toHaveBeenCalledWith({
      message: "<span uk-icon='icon: check'></span> Mensagem enviada com sucesso.",
      status: 'primary',
      pos: 'bottom-right'
    });
  });

  it('should handle successful form submission', () => {
    component.notification.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test message'
    });

    jest.spyOn(component, 'notify');
    Object.defineProperty(mockConnectionService, 'isOnline', {
      value: true,
      configurable: true
    });
    
    component.submitContact();

    const req = httpTestingController.expectOne(environment.APIURL);
    req.flush('Success');

    expect(component.notify).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith('SAVEDMESSAGE');
    expect(localStorage.removeItem).toHaveBeenCalledWith('SAVEDMESSAGESENT');
  });

  it('should handle form submission error', () => {
    component.notification.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test message'
    });

    Object.defineProperty(mockConnectionService, 'isOnline', {
      value: true,
      configurable: true
    });
    
    component.submitContact();

    const req = httpTestingController.expectOne(environment.APIURL);
    req.error(new ErrorEvent('Network error'));

    expect(mockUIkit.notification).toHaveBeenCalledWith({
      message: "<span uk-icon='icon: warning'></span> Houve um erro ao enviar sua mensagem",
      status: 'danger',
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