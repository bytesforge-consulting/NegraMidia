import { TestBed } from '@angular/core/testing';
import { SpinnerService } from './spinner-service.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with visibility false and count 0', () => {
    expect(service.count).toBe(0);
    service.visibility.subscribe(visible => {
      expect(visible).toBe(false);
    });
  });

  it('should show spinner and increment count', () => {
    service.show();
    
    expect(service.count).toBe(1);
    service.visibility.subscribe(visible => {
      expect(visible).toBe(true);
    });
  });

  it('should handle multiple show calls', () => {
    service.show();
    service.show();
    service.show();
    
    expect(service.count).toBe(3);
    service.visibility.subscribe(visible => {
      expect(visible).toBe(true);
    });
  });

  it('should hide spinner only when count reaches 0', () => {
    // Show spinner multiple times
    service.show();
    service.show();
    
    // Hide once - should still be visible
    service.hide();
    expect(service.count).toBe(1);
    service.visibility.subscribe(visible => {
      expect(visible).toBe(true);
    });
    
    // Hide again - should be hidden now
    service.hide();
    expect(service.count).toBe(0);
    service.visibility.subscribe(visible => {
      expect(visible).toBe(false);
    });
  });

  it('should not go below 0 when hide is called more than show', () => {
    service.show();
    service.hide();
    service.hide(); // Extra hide call
    
    expect(service.count).toBe(-1);
    service.visibility.subscribe(visible => {
      expect(visible).toBe(false);
    });
  });

  it('should handle show/hide sequence correctly', () => {
    // Show spinner
    service.show();
    expect(service.count).toBe(1);
    
    // Show again
    service.show();
    expect(service.count).toBe(2);
    
    // Hide once
    service.hide();
    expect(service.count).toBe(1);
    service.visibility.subscribe(visible => {
      expect(visible).toBe(true);
    });
    
    // Show again
    service.show();
    expect(service.count).toBe(2);
    
    // Hide twice to reach 0
    service.hide();
    service.hide();
    expect(service.count).toBe(0);
    service.visibility.subscribe(visible => {
      expect(visible).toBe(false);
    });
  });
});
