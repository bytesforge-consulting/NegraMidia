import { Injectable } from '@angular/core';

declare let UIkit: any;

export interface NotificationOptions {
  message: string;
  status?: 'primary' | 'success' | 'warning' | 'danger';
  pos?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  timeout?: number;
}

export interface BrowserNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  silent?: boolean;
  lang?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  /**
   * Exibe uma notificação UIkit com suporte a i18n
   */
  showUikitNotification(messageKey: string, status: 'primary' | 'success' | 'warning' | 'danger' = 'primary', options?: Partial<NotificationOptions>): void {
    const message = this.getTranslatedMessage(messageKey);
    const icon = this.getIconForStatus(status);

    UIkit.notification({
      message: `<span uk-icon='icon: ${icon}'></span> ${message}`,
      status,
      pos: options?.pos || 'bottom-right',
      timeout: options?.timeout || 5000
    });
  }

  /**
   * Exibe uma notificação do navegador com suporte a i18n
   */
  showBrowserNotification(titleKey: string, bodyKey: string, options?: Partial<BrowserNotificationOptions>): void {
    if (!('Notification' in window)) {
      return;
    }

    const title = this.getTranslatedMessage(titleKey);
    const body = this.getTranslatedMessage(bodyKey);

    const notificationOptions: BrowserNotificationOptions = {
      title,
      body,
      icon: options?.icon || '/icons/icon-128x128.png',
      silent: options?.silent ?? true,
      lang: options?.lang || 'pt-BR'
    };

    new Notification(title, notificationOptions);
  }

  /**
   * Solicita permissão para notificações do navegador
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return Notification.permission === 'granted';
  }

  /**
   * Verifica se as notificações do navegador estão disponíveis
   */
  isNotificationSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Verifica se as notificações do navegador estão permitidas
   */
  isNotificationPermissionGranted(): boolean {
    return this.isNotificationSupported() && Notification.permission === 'granted';
  }

  /**
   * Obtém mensagem traduzida usando $localize
   */
  private getTranslatedMessage(key: string): string {
    // Mapeamento de chaves para mensagens traduzidas
    const messages: { [key: string]: string } = {
      'notification.success': $localize`:@@notificationSuccess:Mensagem enviada com sucesso.`,
      'notification.error': $localize`:@@notificationError:Houve um erro ao enviar sua mensagem`,
      'notification.validation.required': $localize`:@@notificationValidationRequired:Por favor, preencha todos os campos obrigatórios`,
      'notification.validation.server': $localize`:@@notificationValidationServer:Erro interno do servidor. Tente novamente mais tarde.`,
      'notification.offline': $localize`:@@notificationOffline:Parece estar sem conexão, assim que reestabelecida a mensagem será enviada.`,
      'notification.title': $localize`:@@notificationTitle:Notificação - Negra Mídia`,
      'notification.unknown': $localize`:@@notificationUnknown:Erro desconhecido ao enviar mensagem`
    };

    return messages[key] || key;
  }

  /**
   * Obtém o ícone apropriado para cada status
   */
  private getIconForStatus(status: string): string {
    const icons: { [key: string]: string } = {
      'success': 'check',
      'primary': 'check',
      'warning': 'warning',
      'danger': 'warning'
    };

    return icons[status] || 'info';
  }

  /**
   * Exibe notificação de sucesso
   */
  showSuccess(messageKey: string = 'notification.success', options?: Partial<NotificationOptions>): void {
    this.showUikitNotification(messageKey, 'success', options);
  }

  /**
   * Exibe notificação de erro
   */
  showError(messageKey: string = 'notification.error', options?: Partial<NotificationOptions>): void {
    this.showUikitNotification(messageKey, 'danger', options);
  }

  /**
   * Exibe notificação de aviso
   */
  showWarning(messageKey: string, options?: Partial<NotificationOptions>): void {
    this.showUikitNotification(messageKey, 'warning', options);
  }

  /**
   * Exibe notificação de informação
   */
  showInfo(messageKey: string, options?: Partial<NotificationOptions>): void {
    this.showUikitNotification(messageKey, 'primary', options);
  }

  /**
   * Exibe notificação de erro de validação
   */
  showValidationError(error: any): void {
    let messageKey = 'notification.error';

    if (typeof error === 'string') {
      if (error.includes('Todos os campos são obrigatórios')) {
        messageKey = 'notification.validation.required';
      } else {
        messageKey = 'notification.unknown';
      }
    } else if (error && typeof error === 'object') {
      // Para objetos, verificar se tem uma propriedade que contenha a mensagem
      const errorString = JSON.stringify(error);
      if (errorString.includes('Todos os campos são obrigatórios')) {
        messageKey = 'notification.validation.required';
      } else {
        messageKey = 'notification.validation.server';
      }
    }

    this.showError(messageKey);
  }

  /**
   * Exibe notificação de conexão offline
   */
  showOfflineNotification(): void {
    this.showWarning('notification.offline');
  }
}
