import { TestBed } from '@angular/core/testing';
import { ConnectionStatusService } from './connection-status.service';

describe('ConnectionStatusService', () => {
  let service: ConnectionStatusService;
  let originalNavigator: any;

  beforeEach(() => {
    // Mock navigator.onLine
    originalNavigator = window.navigator;
    Object.defineProperty(window, 'navigator', {
      value: {
        ...originalNavigator,
        onLine: true
      },
      writable: true
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectionStatusService);
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return online status from navigator', () => {
    // Test online
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true
    });
    expect(service.isOnline).toBe(true);

    // Test offline
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true
    });
    expect(service.isOnline).toBe(false);
  });

  it('should provide connection status as observable', (done) => {
    service.connectionStatus.subscribe(status => {
      expect(typeof status).toBe('boolean');
      done();
    });
  });

  it('should initialize with current online status', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true
    });
    
    const newService = new ConnectionStatusService();
    
    expect(newService.isOnline).toBe(true);
  });

  it('should respond to online/offline events', () => {
    const spy = jest.spyOn(service['connected$'], 'next');
    
    // Simulate online event
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      writable: true
    });
    window.dispatchEvent(new Event('online'));
    
    expect(spy).toHaveBeenCalledWith(true);
    
    // Simulate offline event
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true
    });
    window.dispatchEvent(new Event('offline'));
    
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should emit status changes through connectionStatus observable', (done) => {
    let callCount = 0;
    
    service.connectionStatus.subscribe(status => {
      callCount++;
      
      if (callCount === 1) {
        // First emission should be initial online status
        expect(typeof status).toBe('boolean');
        done();
      }
    });
  });
});