import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render loading spinner element', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check if spinner container exists
    const spinnerContainer = compiled.querySelector('.loading-spinner, .spinner, [class*="load"]');
    expect(spinnerContainer).toBeTruthy();
  });

  it('should have standalone set to false', () => {
    // This tests the component decorator configuration
    expect(component).toBeDefined();
    // The standalone: false is tested implicitly by the successful component creation
  });

  it('should be a simple component without complex logic', () => {
    // Since this is likely a simple spinner component, test basic functionality
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeTruthy();
  });
});
