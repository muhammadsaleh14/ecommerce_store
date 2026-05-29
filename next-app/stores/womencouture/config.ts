import type { StoreTheme, StoreContent } from '../types'

export const config: { theme: StoreTheme; content: StoreContent } = {
  theme: {
    bg: '#FFF3E0',
    accent: '#FF006E',
    borderColor: '#000',
    shadow: '4px 4px 0px #000',
    shadowHover: '6px 6px 0px #000',
    borderRadius: '0px',
  },
  content: {
    name: 'Women Couture',
    tagline: 'Where Tradition Meets Trend',
    currency: 'Rs.',
    hero: {
      title: 'Where Tradition\nMeets Trend',
      badge: 'Eid Collection 2026',
      subtitle: 'Discover Pakistani fashion that celebrates your heritage. Embroidered chiffons, luxury lawns, and unstitched fabrics — crafted for the modern woman.',
      cta: 'Shop Now',
      ctaSecondary: 'Explore Collection',
      image: 'https://images.unsplash.com/photo-1583391733958-650f0c0850a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  },
}
