import type { PageSeo } from './seoCore'
import { inferOgImageType } from './seoCore'

const JSON_LD_ID = 'page-seo-jsonld'

function setMeta(name: string, content: string | undefined): void {
  const selector = `meta[name="${name}"]`
  let element = document.querySelector<HTMLMetaElement>(selector)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setProperty(property: string, content: string | undefined): void {
  const selector = `meta[property="${property}"]`
  let element = document.querySelector<HTMLMetaElement>(selector)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(href: string | undefined): void {
  const selector = 'link[rel="canonical"]'
  let element = document.querySelector<HTMLLinkElement>(selector)
  if (!href) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function setJsonLd(data: object | object[] | undefined): void {
  let element = document.getElementById(JSON_LD_ID)
  if (!data) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('script')
    element.id = JSON_LD_ID
    document.head.appendChild(element)
  }
  const script = element as HTMLScriptElement
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
}

/** Apply per-route SEO tags after client-side navigation. */
export function applyPageSeo(seo: PageSeo): void {
  document.title = seo.title
  setMeta('description', seo.description)
  setMeta('robots', seo.noindex ? 'noindex, follow' : undefined)
  setCanonical(seo.canonicalUrl)

  setProperty('og:title', seo.title)
  setProperty('og:description', seo.description)
  setProperty('og:url', seo.canonicalUrl)
  setProperty('og:image', seo.imageUrl)
  setProperty('og:image:width', String(seo.imageWidth))
  setProperty('og:image:height', String(seo.imageHeight))
  setProperty('og:image:alt', seo.imageAlt)

  const imageType = inferOgImageType(seo.imageUrl)
  setProperty('og:image:type', imageType)

  setMeta('twitter:card', 'summary_large_image')
  setMeta('twitter:title', seo.title)
  setMeta('twitter:description', seo.description)
  setMeta('twitter:image', seo.imageUrl)
  setMeta('twitter:image:alt', seo.imageAlt)

  setJsonLd(seo.jsonLd)
}
