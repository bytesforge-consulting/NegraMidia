import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { MetaTranslationService } from './meta-translation.service';

describe('MetaTranslationService', () => {
  let service: MetaTranslationService;
  let mockMeta: jest.Mocked<Meta>;
  let mockTitle: jest.Mocked<Title>;
  let mockDocument: any;

  beforeEach(() => {
    // Create mocks
    mockMeta = {
      updateTag: jest.fn(),
      addTag: jest.fn(),
      getTag: jest.fn(),
      removeTag: jest.fn(),
      addTags: jest.fn(),
      removeTagElement: jest.fn(),
      getTags: jest.fn()
    } as any;

    mockTitle = {
      setTitle: jest.fn(),
      getTitle: jest.fn()
    } as any;

    mockDocument = {
      location: {
        origin: 'https://example.com',
        pathname: '/test'
      },
      querySelector: jest.fn(),
      createElement: jest.fn()
    };

    Object.defineProperty(mockDocument, 'head', {
      value: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
        querySelector: jest.fn()
      },
      configurable: true
    });

    TestBed.configureTestingModule({
      providers: [
        MetaTranslationService,
        { provide: Meta, useValue: mockMeta },
        { provide: Title, useValue: mockTitle },
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });

    service = TestBed.inject(MetaTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update page title when updateMetaTags is called', () => {
    service.updateMetaTags();
    
    expect(mockTitle.setTitle).toHaveBeenCalledWith(
      expect.stringContaining('Negra Mídia')
    );
  });

  it('should update meta description tag', () => {
    service.updateMetaTags();
    
    expect(mockMeta.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: expect.stringContaining('comunicação')
    });
  });

  it('should update meta keywords tag', () => {
    service.updateMetaTags();
    
    expect(mockMeta.updateTag).toHaveBeenCalledWith({
      name: 'keywords',
      content: expect.stringContaining('agência de comunicação')
    });
  });

  it('should update Open Graph tags', () => {
    service.updateMetaTags();
    
    expect(mockMeta.updateTag).toHaveBeenCalledWith({
      property: 'og:title',
      content: expect.stringContaining('Negra Mídia')
    });
    
    expect(mockMeta.updateTag).toHaveBeenCalledWith({
      property: 'og:description',
      content: expect.stringContaining('comunicação')
    });
  });

  it('should update Twitter meta tags', () => {
    service.updateMetaTags();
    
    expect(mockMeta.updateTag).toHaveBeenCalledWith({
      name: 'twitter:title',
      content: expect.stringContaining('Negra Mídia')
    });
    
    expect(mockMeta.updateTag).toHaveBeenCalledWith({
      name: 'twitter:description',
      content: expect.stringContaining('comunicação')
    });
  });

  it('should update canonical URL', () => {
    const mockCanonicalElement = {
      setAttribute: jest.fn()
    } as any;
    
    mockDocument.querySelector = jest.fn().mockReturnValue(mockCanonicalElement);

    service.updateCanonicalUrl();
    
    expect(mockCanonicalElement.setAttribute).toHaveBeenCalledWith(
      'href',
      'https://example.com/test'
    );
  });

  it('should create canonical link if it does not exist', () => {
    const mockNewCanonicalElement = {
      setAttribute: jest.fn()
    } as any;

    mockDocument.querySelector = jest.fn().mockReturnValue(null);
    mockDocument.createElement = jest.fn().mockReturnValue(mockNewCanonicalElement);

    service.updateCanonicalUrl();
    
    expect(mockDocument.createElement).toHaveBeenCalledWith('link');
    expect(mockNewCanonicalElement.setAttribute).toHaveBeenCalledWith('rel', 'canonical');
    expect(mockNewCanonicalElement.setAttribute).toHaveBeenCalledWith(
      'href',
      'https://example.com/test'
    );
    expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockNewCanonicalElement);
  });

  it('should call updateInvisibleH1 when updateMetaTags is called', () => {
    const spy = jest.spyOn(service, 'updateInvisibleH1' as any);
    
    service.updateMetaTags();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should handle updateInvisibleH1 correctly', () => {
    const mockH1Element = {
      textContent: '',
      style: {} as CSSStyleDeclaration
    } as any;

    mockDocument.querySelector = jest.fn().mockReturnValue(mockH1Element);
    
    // Call the private method through updateMetaTags
    service.updateMetaTags();
    
    expect(mockDocument.querySelector).toHaveBeenCalledWith('h1[aria-hidden="true"]');
  });
});