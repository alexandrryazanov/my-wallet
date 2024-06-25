import ItemCard from "@/components/ItemCard";
import { items } from "@/mock-data/items";

export default function ItemsPage() {
  return (
    <section className="flex flex-wrap gap-4">
      {items.map((item) => (
        <ItemCard item={item} key={item.id} />
      ))}
    </section>
  );
}
