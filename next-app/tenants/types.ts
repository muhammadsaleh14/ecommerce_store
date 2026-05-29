import type { ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any

export interface TenantTheme {
  bg: string
  accent: string
  borderColor: string
  shadow: string
  shadowHover: string
  borderRadius: string
}

export interface TenantContent {
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

export interface TenantPages {
  HomePage: (props: { products: AnyData[] }) => ReactNode
  ProductsPage: (props: { products: AnyData[] }) => ReactNode
  ProductDetailPage: (props: { product: AnyData }) => ReactNode
}

export interface TenantComponents {
  Layout: (props: { children: ReactNode }) => ReactNode
  ProductCard: (props: { product: AnyData }) => ReactNode
}

export interface TenantDefinition {
  id: string
  theme: TenantTheme
  content: TenantContent
  pages: TenantPages
  components: TenantComponents
}
