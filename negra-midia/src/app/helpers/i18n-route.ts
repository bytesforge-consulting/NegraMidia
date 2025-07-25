import { Routes } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';

// Registrar os locales
registerLocaleData(localePt, 'pt');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeEs, 'es');

/**
 * Helper para criar rotas com suporte a i18n
 * @param routes Rotas da aplicação
 * @returns Rotas com suporte a i18n
 */
export function i18nRoute(routes: Routes): Routes {
  // As rotas já são configuradas pelo Angular baseado no locale
  // Não precisamos adicionar prefixos manualmente, pois o Angular
  // já faz isso baseado na configuração do angular.json
  return routes;
}
