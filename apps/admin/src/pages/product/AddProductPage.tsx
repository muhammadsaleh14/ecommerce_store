import { useNavigate } from "react-router";
import { useAddProduct } from "../../hooks/queries/useProducts";
import { ProductForm } from "./components/ProductForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductInput } from "@ecommerce/shared";

export const AddProductPage = () => {
  const navigate = useNavigate();
  const addMutation = useAddProduct();

  const handleAdd = async (input: ProductInput) => {
    await addMutation.mutateAsync(input);
    navigate("/admin/products");
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={handleAdd} />
        </CardContent>
      </Card>
    </div>
  );
};
