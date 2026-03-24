import { Banner } from "./components/banner";
import { ProductGrid } from "./components/products";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Banner />
      <ProductGrid />
    </main>
  );
}
