import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetaTranslationService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Atualiza as meta tags e o título com base nas traduções
   */
  updateMetaTags(): void {
    // Atualiza o título da página
    const pageTitle = $localize`:@@pageTitle:Negra Mídia - Comunicação com propósito`;
    this.title.setTitle(pageTitle);

    // Atualiza as meta tags
    const metaDescription = $localize`:@@metaDescription:Comunicação estratégica, marketing digital, storytelling e conteúdo com foco em diversidade e representatividade.`;
    const metaKeywords = $localize`:@@metaKeywords:agência de comunicação, marketing digital, produção de conteúdo, jornalismo negro, consultoria em mídia, newsletter empresarial, reportagens especializadas, comunicação estratégica, diversidade na mídia, representatividade negra, gestão de redes sociais, produção de e-books, assessoria de imprensa`;

    // Atualiza as meta tags básicas
    this.meta.updateTag({ name: 'description', content: metaDescription });
    this.meta.updateTag({ name: 'keywords', content: metaKeywords });

    // Atualiza as meta tags Open Graph
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: metaDescription });

    // Atualiza as meta tags Twitter
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: metaDescription });

    this.updateInvisibleH1();
  }

  /**
   * Atualiza o URL canônico com base na URL atual
   */
  updateCanonicalUrl(): void {
    const baseUrl = this.document.location.origin;
    const currentPath = document.location.pathname;
    const canonicalUrl = baseUrl + currentPath;
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }

  /**
   * Atualiza o conteúdo do h1 invisível com base na tradução
   */
  private updateInvisibleH1(): void {
    const h1Element = this.document.querySelector('h1[style="display: none;"]');
    const invisibleH1Text = $localize`:@@invisibleH1Title:Negra Mídia - Agência de Comunicação Especializada em Conteúdo Antirracista e Diversidade`;

    if (h1Element) {
      h1Element.textContent = invisibleH1Text;
    }
  }
}
