import { config } from '../config'
import { ProductCard } from '../components/ProductCard'
import Link from 'next/link'

export function HomePage({ products }: { products: any[] }) {
  const { theme, content } = config

  return (
    <>
      <section className="flex items-center justify-between px-[10%] min-h-[70vh]">
        <div className="flex-1 pr-12">
          {content.hero.badge && (
            <span
              className="inline-block text-[11px] font-bold uppercase px-2 py-1 mb-5"
              style={{
                border: `2px solid ${theme.borderColor}`,
              }}
            >
              {content.hero.badge}
            </span>
          )}
          <h1 className="font-['Playfair_Display',_serif] text-5xl sm:text-6xl font-bold leading-[1.05] mb-5 whitespace-pre-line">
            {content.hero.title}
          </h1>
          <p className="text-base mb-8 leading-relaxed max-w-md" style={{ color: 'rgba(0,0,0,0.7)' }}>
            {content.hero.subtitle}
          </p>
          <div className="flex gap-4">
            <Link
              href="/products"
              className="text-white px-8 py-3.5 font-bold uppercase tracking-wider text-xs transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{
                backgroundColor: theme.accent,
                border: `2px solid ${theme.borderColor}`,
                boxShadow: `5px 5px 0px ${theme.borderColor}`,
              }}
            >
              {content.hero.cta}
            </Link>
            {content.hero.ctaSecondary && (
              <Link
                href="/products"
                className="bg-white px-8 py-3.5 font-bold uppercase tracking-wider text-xs transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
                style={{
                  border: `2px solid ${theme.borderColor}`,
                  boxShadow: `5px 5px 0px ${theme.borderColor}`,
                }}
              >
                {content.hero.ctaSecondary}
              </Link>
            )}
          </div>
        </div>
        <div
          className="flex-1 h-[500px] bg-cover bg-center"
          style={{
            border: `2px solid ${theme.borderColor}`,
            boxShadow: `8px 8px 0px ${theme.borderColor}`,
            backgroundImage: `url('${content.hero.image}')`,
          }}
        />
      </section>

      <section className="border-y-2 bg-white" style={{ borderColor: theme.borderColor }}>
        <div className="grid grid-cols-3 divide-x-2" style={{ borderColor: theme.borderColor }}>
          <div className="py-8 text-center">
            <p className="font-['Playfair_Display',_serif] text-3xl font-bold" style={{ color: theme.accent }}>
              Premium
            </p>
            <p className="text-xs font-bold uppercase tracking-wider mt-1">Quality Fabrics</p>
          </div>
          <div className="py-8 text-center">
            <p className="font-['Playfair_Display',_serif] text-3xl font-bold" style={{ color: theme.accent }}>
              Pan Pakistan
            </p>
            <p className="text-xs font-bold uppercase tracking-wider mt-1">Free Delivery</p>
          </div>
          <div className="py-8 text-center">
            <p className="font-['Playfair_Display',_serif] text-3xl font-bold" style={{ color: theme.accent }}>
              Easy
            </p>
            <p className="text-xs font-bold uppercase tracking-wider mt-1">Exchange &amp; Returns</p>
          </div>
        </div>
      </section>

      <section className="px-[10%] py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-['Playfair_Display',_serif] text-3xl font-bold">Trending Now</h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(0,0,0,0.6)' }}>
              Most loved pieces this season
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold uppercase underline underline-offset-4 transition-colors"
            style={{ color: 'inherit' }}
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(!products || products.length === 0) && (
            <p className="col-span-full text-center" style={{ color: 'rgba(0,0,0,0.6)' }}>
              No products yet.
            </p>
          )}
          {products?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="px-[10%] py-16 bg-black text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-['Playfair_Display',_serif] text-3xl sm:text-4xl font-bold mb-4">
            The Perfect Fit Awaits
          </h2>
          <p className="text-sm sm:text-base text-white/70 mb-8 leading-relaxed">
            From festive occasions to everyday elegance — find your style in our curated collection of Pakistani
            fashion.
          </p>
          <Link
            href="/products"
            className="inline-block text-white px-8 py-3.5 font-bold uppercase tracking-wider text-xs transition-all hover:translate-x-[-2px] hover:translate-y-[-2px]"
            style={{
              backgroundColor: theme.accent,
              border: `2px solid #fff`,
              boxShadow: `5px 5px 0px #fff`,
            }}
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </>
  )
}
