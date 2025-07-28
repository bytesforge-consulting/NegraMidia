import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { i18nRoute } from "./helpers/i18n-route";

// Definir as rotas da aplicação
const routes: Routes = [
  // Rota para redirecionar implicitamente para /pt
  { path: '', redirectTo: '/pt', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(i18nRoute(routes), {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
