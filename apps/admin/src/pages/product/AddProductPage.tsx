import { useNavigate } from "react-router";
import { addProduct } from "@ecommerce/shared";
import { ProductForm } from "./components/ProductForm";
import type { ProductInput } from "@ecommerce/shared";

export const AddProductPage = () => {
  const navigate = useNavigate();

  const handleAdd = async (input: ProductInput) => {
    await addProduct(input);
    navigate("/admin/products");
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <ProductForm onSubmit={handleAdd} />
    </div>
  );
};
