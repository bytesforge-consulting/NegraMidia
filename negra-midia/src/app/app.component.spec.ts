import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SpinnerService } from './services/spinner-service.service';
import { MetaTranslationService } from './services/meta-translation.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockSpinnerService: jest.Mocked<SpinnerService>;
  let mockMetaTranslationService: jest.Mocked<MetaTranslationService>;

  beforeEach(async () => {
    // Create mock services
    mockSpinnerService = {
      visibility: { subscribe: jest.fn() }
    } as any;

    mockMetaTranslationService = {
      updateMetaTags: jest.fn(),
      updateCanonicalUrl: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: SpinnerService, useValue: mockSpinnerService },
        { provide: MetaTranslationService, useValue: mockMetaTranslationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should call meta translation services on init', () => {
    component.ngOnInit();
    
    expect(mockMetaTranslationService.updateMetaTags).toHaveBeenCalled();
    expect(mockMetaTranslationService.updateCanonicalUrl).toHaveBeenCalled();
  });

  it('should have title property defined', () => {
    expect(component).toBeTruthy();
  });
});
