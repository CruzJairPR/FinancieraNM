export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  assignment: string;
  material: string;
  condition: string;
  daysLeft: string;
  basePrice: number;
  salePrice: number;
  finalPrice: number;
  margin: string;
  images: string[];
}

export interface DataTableProps {
  data: InventoryItem[];
  selectedItems: string[];
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectItem: (id: string) => void;
}
