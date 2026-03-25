import { Banner } from "./components/banner";
import { ProductGrid } from "./components/products";
import CustomerReviews from "./components/CustomerReviews";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Banner />
      <ProductGrid />
      <CustomerReviews />
    </main>
  );
}
