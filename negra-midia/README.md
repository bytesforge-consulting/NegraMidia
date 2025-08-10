# NegraMidia

## Descrição

NegraMidia é uma aplicação web desenvolvida em Angular 18 que oferece suporte a múltiplos idiomas (Português, Inglês e Espanhol). A aplicação funciona como uma Single Page Application (SPA) e inclui recursos de Progressive Web App (PWA) através do Angular Service Worker.

Seu objetivo é informar os visitantes dos serviços oferecidos pela Negra Mídia, bem como apresentar informações sobre a empresa e seu time.

## Estrutura do Projeto

```
├── public/                  # Arquivos públicos estáticos
│   ├── _redirects           # Regras de redirecionamento para SPA
│   ├── content/             # Conteúdo estático (imagens, etc.)
│   ├── css/                 # Arquivos CSS (UIKit)
│   ├── js/                  # Scripts JavaScript
│   ├── icons/               # Ícones para PWA
│   ├── manifest.webmanifest # Configuração do PWA
│   └── screenshots/         # Capturas de tela do aplicativo
├── src/                     # Código-fonte da aplicação
│   ├── app/                 # Componentes e lógica Angular
│   │   ├── components/      # Componentes da aplicação
│   │   ├── helpers/         # Funções auxiliares
│   │   ├── interfaces/      # Interfaces TypeScript
│   │   └── services/        # Serviços Angular
│   ├── assets/              # Recursos estáticos
│   │   └── i18n/            # Arquivos de internacionalização
│   └── environments/        # Configurações de ambiente
└── angular.json            # Configuração principal do Angular
```

## Requisitos

- Node.js: versão ^18.19.1, ^20.11.1 ou >=22.0.0
- Angular CLI: versão 18.0.3 ou superior

## Configuração do Ambiente de Desenvolvimento

### Instalação de Dependências

```bash
npm install
```

### Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento em português (idioma padrão):

```bash
npm start
```

Para iniciar o servidor em inglês:

```bash
npm run start:en
```

Para iniciar o servidor em espanhol:

```bash
npm run start:es
```

Para iniciar os servidores em todos os idiomas simultaneamente:

```bash
npm run start:all
```

Para iniciar o servidor simulando ambiente produtivo:

```bash
npm run start:prod
```

Navegue para os seguintes endereços para acessar a aplicação em cada idioma:

- Português: `http://localhost:4200/`
- Inglês: `http://localhost:4201/en/`
- Espanhol: `http://localhost:4202/es/`

A aplicação será recarregada automaticamente se você alterar qualquer um dos arquivos de origem.

## Internacionalização (i18n)

O projeto suporta três idiomas:

- Português (padrão): acessível na raiz do site
- Inglês: acessível em `/en/`
- Espanhol: acessível em `/es/`

Para extrair as strings para tradução:

```bash
npm run extract-i18n
```

Os arquivos de tradução estão localizados em `src/assets/i18n/`.

## Build

### Build para Todos os Idiomas

```bash
npm run build
```

Este comando gera builds para todos os idiomas configurados.

### Build para Idiomas Específicos

Para português:

```bash
npm run build:pt
```

Para inglês:

```bash
npm run build:en
```

Para espanhol:

```bash
npm run build:es
```

Os artefatos de build serão armazenados no diretório `dist/negra-midia/browser` para cada idioma.

## Deploy na Cloudflare Pages

### Configuração Inicial

1. Crie uma conta na Cloudflare e acesse o serviço Pages
2. Conecte seu repositório Git (GitHub, GitLab, etc.)
3. Configure as seguintes opções de build:
   - **Comando de build**: `npm run build`
   - **Diretório de saída**: `dist/negra-midia/browser`
   - **Ramificação de produção**: `main`

### Arquivo _redirects

O arquivo `_redirects` localizado em `public/_redirects` é essencial para o funcionamento correto da SPA em ambientes de hospedagem como a Cloudflare Pages. Este arquivo contém regras de redirecionamento que garantem que todas as rotas da aplicação sejam direcionadas corretamente para o arquivo index.html apropriado, permitindo que o Angular Router funcione adequadamente.

```
# Redirecionamentos para SPA
/  /pt/  308
```

Estas regras garantem que:

- Todas as rotas na raiz sejam direcionadas para o index.html em português
- Todas as rotas começando com /en/ sejam direcionadas para o index.html em inglês
- Todas as rotas começando com /es/ sejam direcionadas para o index.html em espanhol

Para mais informações consulte [Redirects](https://developers.cloudflare.com/pages/configuration/redirects) na documentação da Cloudflare

### Variáveis de Ambiente

Para garantir que o deploy funcione corretamente na Cloudflare Pages, pode ser necessário definir manualmente a versão do Node.js. Para isso:

1. Acesse o painel da Cloudflare
2. Navegue até Pages > Configurações > Variáveis de Ambiente
3. Adicione uma nova variável com nome `NODE_VERSION` e valor correspondente à versão desejada (ex: `18.20`)

Além disso, você pode configurar a variável de ambiente `APIURL` para apontar para o endpoint correto da API em produção:

1. Adicione uma variável com nome `APIURL` e valor `https://negramidia.net/api`

### Estrutura de Build

O processo de build gera os arquivos no diretório `dist/negra-midia/browser`. Esta estrutura é importante para o deploy na Cloudflare Pages, pois:

- O diretório raiz contém os arquivos para o idioma português
- O subdiretório `/en` contém os arquivos para o idioma inglês
- O subdiretório `/es` contém os arquivos para o idioma espanhol

### Cache e Service Worker

A aplicação utiliza o Angular Service Worker para funcionalidades de PWA. O arquivo de configuração `ngsw-config.json` define as estratégias de cache e é ativado apenas em builds de produção.

## Testes Locais com Docker e Nginx

O projeto inclui configuração para testes locais utilizando Docker e Nginx, o que permite simular um ambiente de produção em sua máquina local.

### Pré-requisitos

- Docker e Docker Compose instalados em sua máquina
- Build da aplicação gerado (diretório `dist/negra-midia/browser`)

### Arquivos de Configuração

- **docker-compose.yml**: Define o serviço Nginx e mapeia as portas e volumes necessários
- **nginx.conf**: Configura o servidor Nginx para servir a aplicação Angular com suporte a rotas e múltiplos idiomas

### Como Executar

Para construir a aplicação e iniciar o servidor Nginx em um contêiner Docker:

```bash
npm run serve:prod
```

Este comando executa o build da aplicação e inicia o contêiner Docker com Nginx configurado para servir a aplicação.

Alternativamente, se você já tiver o build pronto, pode executar apenas:

```bash
docker-compose up nginx --force-recreate
```

### Acessando a Aplicação

Após iniciar o contêiner, a aplicação estará disponível em:

```
http://localhost:9000/
```

O Nginx está configurado para redirecionar corretamente as rotas para cada idioma:
- Português: `http://localhost:9000/pt/`
- Inglês: `http://localhost:9000/en/`
- Espanhol: `http://localhost:9000/es/`

### Estrutura de Arquivos Docker

```
├── docker-compose.yml    # Configuração do Docker Compose
└── nginx.conf           # Configuração do servidor Nginx
```

## Solução de Problemas Comuns

### Erro de Versão do Node.js

Se o build falhar na Cloudflare com erros relacionados à versão do Node.js, verifique se a variável de ambiente `NODE_VERSION` está configurada corretamente conforme as versões suportadas no `package.json`.

### Problemas com Redirecionamentos

Se as rotas não estiverem funcionando corretamente após o deploy, verifique se o arquivo `_redirects` está sendo incluído corretamente no build. O arquivo deve estar presente no diretório `public` e ser copiado para o diretório de saída durante o build.

### Variáveis de Ambiente não Aplicadas

Se as variáveis de ambiente não estiverem sendo aplicadas corretamente, verifique se elas estão configuradas no painel da Cloudflare e se o processo de build está substituindo corretamente os valores no arquivo `environment.ts`.

### Problemas com Docker

Se o contêiner Docker não iniciar corretamente, verifique:
- Se o Docker e o Docker Compose estão instalados e funcionando
- Se o build da aplicação foi gerado corretamente em `dist/negra-midia/browser`
- Se as portas necessárias (9000) estão disponíveis em sua máquina

## Recursos Adicionais

- [Documentação do Angular](https://angular.dev)
- [Documentação da Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Guia de Internacionalização do Angular](https://angular.dev/guide/i18n)

## Cloudflare R2 para Imagens

Todas as imagens utilizadas na aplicação agora são servidas diretamente do Cloudflare R2, e não mais do diretório local `public/content`. Para adicionar ou atualizar imagens, faça upload dos arquivos para o bucket R2 e utilize as URLs públicas correspondentes.

O arquivo `angular.json` foi ajustado para ignorar completamente a pasta `public/content` durante o build, garantindo que nenhuma imagem local seja incluída no deploy.

Outros arquivos estáticos (como favicon, manifest, fontes, CSS e JS) continuam sendo servidos localmente pela pasta `public`.

## Como adicionar regras de redirecionamento na Cloudflare

1. Acesse o painel da Cloudflare e selecione o domínio desejado.
2. No menu lateral, clique em **Regras** > **Regras de redirecionamento**.
3. Clique em **Criar regra**.
4. Dê um nome para a regra (ex: "redirect www").
5. Defina a condição (ex: "Nome do host contém www").
6. Escolha a ação **Redirecionar URL** e selecione o código de status (geralmente 308).
7. No campo de destino, insira a URL para onde deseja redirecionar (ex: `https://dominio.com/$1`).
8. Salve e ative a regra.

### Redirecionamento da raiz para /pt

1. Acesse o painel da Cloudflare e selecione o domínio desejado.
2. No menu lateral, clique em **Regras** > **Regras de redirecionamento**.
3. Clique em **Criar regra**.
4. Dê um nome para a regra (ex: "Redirecionar raiz para /pt").
5. Defina a condição como "Caminho da URL é igual a /".
6. Escolha a ação **Redirecionar URL** e selecione o código de status 302 (redirecionamento temporário).
7. No campo de destino, insira a URL `https://seudominio.com/pt/`.
8. Salve e ative a regra.

**Importante**: A ordem das regras importa. Certifique-se de que a regra de redirecionamento www para não-www seja executada antes da regra de redirecionamento da raiz para /pt.

## Como usar modelos de regras existentes

1. Na tela de **Regras de redirecionamento**, clique em **Modelos** (canto superior direito).
2. Escolha um modelo pronto, como "Redirecionar www para não-www" ou "Redirecionar HTTP para HTTPS".
3. Clique em **Usar modelo**.
4. Ajuste os parâmetros conforme necessário para o seu domínio.
5. Salve e ative a regra.

## Configuração de Redirecionamento por País/Idioma

Para configurar redirecionamentos baseados no país de origem do visitante, siga estas instruções:

1. Acesse o painel da Cloudflare e selecione o domínio desejado.
2. No menu lateral, clique em **Regras** > **Regras de redirecionamento**.
3. Crie as seguintes regras na ordem especificada:

### 1. Regra para a Raiz (Maior Prioridade, desabilitada)

- **Nome**: Redirecionar Raiz para PT
- **Expressão**:

```
(http.request.uri.path eq "/")
```

- **Ação**: Redirecionar para URL
- **Status**: 308 (Permanentemente movido)
- **URL de Destino**:

```
https://negramidia.net/pt
```

### 2. Regra para Português

- **Nome**: Redirecionar para PT (Países Lusófonos)
- **Expressão**:

```
(ip.src.country in {"BR" "PT" "AO" "MZ" "CV" "GW" "ST" "TL" "GQ"}) and (http.request.uri.path eq "/")
```

- **Ação**: Redirecionar para URL
- **Status**: 308 (Permanentemente movido)
- **URL de Destino**:

```
https://negramidia.net/pt
```

### 3. Regra para Espanhol

- **Nome**: Redirecionar para ES (Países Hispânicos)
- **Expressão**:

```
(ip.src.country in {"ES" "MX" "AR" "CO" "PE" "VE" "CL" "EC" "GT" "CU" "BO" "DO" "HN" "PY" "SV" "NI" "CR" "PA" "UY" "PR"}) and (http.request.uri.path eq "/")
```

- **Ação**: Redirecionar para URL
- **Status**: 308 (Permanentemente movido)
- **URL de Destino**:

```
https://negramidia.net/es
```

### 4. Regra para Inglês

- **Nome**: Redirecionar para EN (Padrão)
- **Expressão**:

```
(ip.src.country in {"US" "GB" "CA" "AU" "NZ" "IE" "JM" "BZ" "BS" "BB" "TT" "GY" "AG" "DM" "GD" "KN" "LC" "VC" "ZA" "NA" "BW" "ZW" "GH" "LR" "SL" "GM" "NG" "KE" "UG" "TZ" "RW" "SG" "MY" "IN" "PK" "PH" "FJ"}) and (http.request.uri.path eq "/")
```

- **Ação**: Redirecionar para URL
- **Status**: 308 (Permanentemente movido)
- **URL de Destino**:

```
https://negramidia.net/en
```

### 5. Regra para Inglês - Fallback (Menor Prioridade)

- **Nome**: Redirecionar para EN (Fallback)
- **Expressão**:

```
http.request.uri.path eq "/"
```

- **Ação**: Redirecionar para URL
- **Status**: 308 (Permanentemente movido)
- **URL de Destino**:

```
https://negramidia.net/en
```

![image.png](/doc/cloudflare-redirect-rules.png)
**Importante**: A ordem das regras é crucial. Elas devem ser configuradas na ordem exata listada acima (Raiz → Português → Espanhol → Inglês) para garantir o funcionamento correto. A condição `http.request.uri.path eq "/"` garante que os redirecionamentos só ocorram quando o usuário acessar a raiz do site, preservando qualquer caminho já definido.
