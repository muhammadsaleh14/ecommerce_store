import type { ReactNode } from 'react'

export interface StoreTheme {
  bg: string
  accent: string
  borderColor: string
  shadow: string
  shadowHover: string
  borderRadius: string
}

export interface StoreContent {
  name: string
  tagline: string
  currency: string
  hero: {
    title: string
    badge?: string
    subtitle: string
    cta: string
    ctaSecondary?: string
    image: string
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any

export interface StorePages {
  HomePage: (props: { products: AnyData[] }) => ReactNode
  ProductsPage: (props: { products: AnyData[] }) => ReactNode
  ProductDetailPage: (props: { product: AnyData }) => ReactNode
}

export interface StoreComponents {
  Layout: (props: { children: ReactNode }) => ReactNode
  ProductCard: (props: { product: AnyData }) => ReactNode
  VariantSelector: (props: { variants: AnyData[] }) => ReactNode
}

export interface StoreDefinition {
  id: string
  theme: StoreTheme
  content: StoreContent
  pages: StorePages
  components: StoreComponents
}
