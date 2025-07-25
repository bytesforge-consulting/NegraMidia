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
    const metaDescription = $localize`:@@metaDescription:Negra Mídia: Agência especializada em comunicação estratégica, marketing digital e produção de conteúdo jornalístico com foco em representatividade e diversidade. Newsletters, reportagens e consultoria em mídia social personalizados para seu negócio.`;
    const metaKeywords = $localize`:@@metaKeywords:agência de comunicação, marketing digital, produção de conteúdo, jornalismo negro, consultoria em mídia, newsletter empresarial, reportagens especializadas, comunicação estratégica, diversidade na mídia, representatividade negra, gestão de redes sociais, produção de e-books, assessoria de imprensa`;

    // Open Graph
    const ogTitle = $localize`:@@ogTitle:Negra Mídia - Comunicação com propósito`;
    const ogDescription = $localize`:@@ogDescription:Negra Mídia: Agência especializada em comunicação estratégica, marketing digital e produção de conteúdo jornalístico com foco em representatividade e diversidade. Newsletters, reportagens e consultoria em mídia social personalizados para seu negócio.`;

    // Twitter Card
    const twitterTitle = $localize`:@@twitterTitle:Negra Mídia - Comunicação com propósito`;
    const twitterDescription = $localize`:@@twitterDescription:Negra Mídia: Agência especializada em comunicação estratégica, marketing digital e produção de conteúdo jornalístico com foco em representatividade e diversidade. Newsletters, reportagens e consultoria em mídia social personalizados para seu negócio.`;

    // Atualiza as meta tags
    this.meta.updateTag({ name: 'description', content: metaDescription });
    this.meta.updateTag({ name: 'keywords', content: metaKeywords });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDescription });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:title', content: twitterTitle });
    this.meta.updateTag({ name: 'twitter:description', content: twitterDescription });
    this.updateInvisibleH1();
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
