import { TestBed } from '@angular/core/testing';
import { PwaInstalledService } from './pwa-installed.service';

describe('PwaInstalledService', () => {
  let service: PwaInstalledService;
  let originalNavigator: any;
  let originalWindow: any;

  beforeEach(() => {
    // Save original objects
    originalNavigator = window.navigator;
    originalWindow = window;

    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaInstalledService);
  });

  afterEach(() => {
    // Restore original objects
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if navigator.standalone is true (iOS PWA)', () => {
    // Mock iOS PWA scenario
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        standalone: true
      },
      writable: true
    });

    expect(service.isInstalled()).toBe(true);
  });

  it('should return true if display-mode is standalone', () => {
    // Mock navigator without standalone
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        standalone: false
      },
      writable: true
    });

    // Mock matchMedia
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true
    });

    expect(service.isInstalled()).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith('(display-mode: standalone)');
  });

  it('should return false if neither standalone nor display-mode matches', () => {
    // Mock navigator without standalone
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        standalone: false
      },
      writable: true
    });

    // Mock matchMedia to return false
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false
    });

    expect(service.isInstalled()).toBe(false);
  });

  it('should handle getInstalledRelatedApps if available', () => {
    // Mock navigator with getInstalledRelatedApps
    const mockGetInstalledRelatedApps = jest.fn().mockResolvedValue([{ id: 'test-app' }]);
    
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        standalone: false,
        getInstalledRelatedApps: mockGetInstalledRelatedApps
      },
      writable: true
    });

    // Mock matchMedia to return false
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false
    });

    // Note: This method returns synchronously but calls async method
    // The async result doesn't affect the return value immediately
    const result = service.isInstalled();
    expect(result).toBe(false); // Still false because it's async
    expect(mockGetInstalledRelatedApps).toHaveBeenCalled();
  });

  it('should handle missing getInstalledRelatedApps gracefully', () => {
    // Mock navigator without getInstalledRelatedApps
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        standalone: false
      },
      writable: true
    });

    // Mock matchMedia to return false
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false
    });

    expect(service.isInstalled()).toBe(false);
  });

  it('should prioritize standalone over other checks', () => {
    // Mock navigator with standalone true
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        standalone: true
      },
      writable: true
    });

    // Mock matchMedia - this should not be called due to early return
    window.matchMedia = jest.fn();

    expect(service.isInstalled()).toBe(true);
    expect(window.matchMedia).not.toHaveBeenCalled();
  });

  it('should handle undefined standalone property', () => {
    // Mock navigator without standalone property
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator
      },
      writable: true
    });
    delete (window.navigator as any).standalone;

    // Mock matchMedia to return false
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false
    });

    expect(service.isInstalled()).toBe(false);
  });
});
