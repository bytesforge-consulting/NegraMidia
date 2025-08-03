# NegraMidia

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Cloudflare R2 para Imagens

Todas as imagens utilizadas na aplicação agora são servidas diretamente do Cloudflare R2, e não mais do diretório local `public/content`. Para adicionar ou atualizar imagens, faça upload dos arquivos para o bucket R2 e utilize as URLs públicas correspondentes.

O arquivo `angular.json` foi ajustado para ignorar completamente a pasta `public/content` durante o build, garantindo que nenhuma imagem local seja incluída no deploy.

Outros arquivos estáticos (como favicon, manifest, fontes, CSS e JS) continuam sendo servidos localmente pela pasta `public`.
