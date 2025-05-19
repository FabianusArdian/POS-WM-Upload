import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange
}: CategoryTabsProps) {
  return (
    <Tabs defaultValue={activeCategory} className="mb-6">
      <TabsList className="mb-4 flex flex-wrap">
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}