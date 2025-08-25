import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTranslatedMessage', () => {
    it('should return translated message for known keys', () => {
      // Teste indireto através dos métodos públicos
      const spy = jest.spyOn(service as any, 'getTranslatedMessage');

      service.showSuccess();

      expect(spy).toHaveBeenCalledWith('notification.success');
    });
  });

  describe('showSuccess', () => {
    it('should call showUikitNotification with success status', () => {
      const spy = jest.spyOn(service, 'showUikitNotification');

      service.showSuccess();

      expect(spy).toHaveBeenCalledWith('notification.success', 'success', undefined);
    });
  });

  describe('showError', () => {
    it('should call showUikitNotification with danger status', () => {
      const spy = jest.spyOn(service, 'showUikitNotification');

      service.showError();

      expect(spy).toHaveBeenCalledWith('notification.error', 'danger', undefined);
    });
  });

  describe('showWarning', () => {
    it('should call showUikitNotification with warning status', () => {
      const spy = jest.spyOn(service, 'showUikitNotification');

      service.showWarning('notification.offline');

      expect(spy).toHaveBeenCalledWith('notification.offline', 'warning', undefined);
    });
  });

  describe('showInfo', () => {
    it('should call showUikitNotification with primary status', () => {
      const spy = jest.spyOn(service, 'showUikitNotification');

      service.showInfo('notification.success');

      expect(spy).toHaveBeenCalledWith('notification.success', 'primary', undefined);
    });
  });

  describe('showValidationError', () => {
    it('should show validation required error', () => {
      const spy = jest.spyOn(service, 'showError');

      service.showValidationError('Todos os campos são obrigatórios');

      expect(spy).toHaveBeenCalledWith('notification.validation.required');
    });

    it('should show unknown error for unrecognized error', () => {
      const spy = jest.spyOn(service, 'showError');

      service.showValidationError('Some random error');

      expect(spy).toHaveBeenCalledWith('notification.unknown');
    });

    it('should show server error for non-string errors', () => {
      const spy = jest.spyOn(service, 'showError');

      service.showValidationError({ error: 'Some error' });

      expect(spy).toHaveBeenCalledWith('notification.validation.server');
    });
  });

  describe('showOfflineNotification', () => {
    it('should call showWarning with offline message', () => {
      const spy = jest.spyOn(service, 'showWarning');

      service.showOfflineNotification();

      expect(spy).toHaveBeenCalledWith('notification.offline');
    });
  });
});
