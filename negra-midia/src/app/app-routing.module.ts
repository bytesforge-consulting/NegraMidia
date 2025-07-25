import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { i18nRoute } from "./helpers/i18n-route";

// Definir as rotas da aplicação
const routes: Routes = [
  // Rotas da aplicação
  // Como a aplicação é uma SPA sem rotas específicas, não precisamos adicionar rotas aqui
];

@NgModule({
  imports: [RouterModule.forRoot(i18nRoute(routes), {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
