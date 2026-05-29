import './theme.css'
import { config } from './config'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProductCard } from './components/ProductCard'
import type { TenantDefinition } from '../types'

const tenant: TenantDefinition = {
  id: config.content.name.toLowerCase().replace(/\s+/g, ''),
  theme: config.theme,
  content: config.content,
  pages: {
    HomePage,
    ProductsPage,
    ProductDetailPage,
  },
  components: {
    Layout,
    ProductCard,
  },
}

export default tenant
export { config }
