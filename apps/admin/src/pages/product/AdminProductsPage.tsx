import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getProducts, deleteProduct } from "@ecommerce/shared";
import { ProductCard } from "./components/ProductCard";
import type { Product } from "@ecommerce/shared";

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    const data = await getProducts();
    setProducts(data);
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">Loading products...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-black px-4 py-2 text-white text-sm"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
