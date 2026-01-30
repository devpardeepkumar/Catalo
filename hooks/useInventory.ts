import { useEffect, useMemo, useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import { Product } from '../types/product';

export type InventoryTab = 'published' | 'to_be_published' | 'without_info';

export interface InventoryFilters {
  search?: string;
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  inStock?: boolean;
}

export interface InventoryState {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  shouldPaginate: boolean;
  filters: InventoryFilters;
  activeTab: InventoryTab;
}

export interface InventoryActions {
  setActiveTab: (tab: InventoryTab) => void;
  setFilters: (filters: Partial<InventoryFilters>) => void;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
  clearFilters: () => void;
}

export const useInventory = (): InventoryState & InventoryActions => {
  const { products } = useProducts();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [filters, setFiltersState] = useState<InventoryFilters>({});
  const [activeTab, setActiveTab] = useState<InventoryTab>('published');

  // Filter products based on active tab and filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by tab
    switch (activeTab) {
      case 'published':
        // Products that are published (assuming all products in dummy data are published)
        filtered = filtered.filter(product => product.quantity !== undefined && product.quantity > 0);
        break;
      case 'to_be_published':
        // Products that exist but aren't published yet (placeholder logic)
        filtered = filtered.filter(product => !product.description || product.description.length < 10);
        break;
      case 'without_info':
        // Products without manufacturer info (placeholder logic)
        filtered = filtered.filter(product => !product.manufacturerCode);
        break;
    }

    // Apply additional filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.ean?.includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    if (filters.inStock !== undefined) {
      filtered = filtered.filter(product =>
        filters.inStock ? (product.quantity || 0) > 0 : (product.quantity || 0) === 0
      );
    }

    return filtered;
  }, [products, activeTab, filters]);

  // Conditional Pagination: Only paginate if more than 20 items
  const shouldPaginate = filteredProducts.length > 20;
  const totalPages = shouldPaginate ? Math.ceil(filteredProducts.length / itemsPerPage) : 1;
  const paginatedProducts = useMemo(() => {
    if (!shouldPaginate) {
      return filteredProducts; // Show all items if 20 or fewer
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage, shouldPaginate]);

  // Actions
  const setFilters = (newFilters: Partial<InventoryFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would refetch data from API
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFiltersState({});
    setCurrentPage(1);
  };

  // Auto-reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return {
    products: paginatedProducts,
    filteredProducts,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    shouldPaginate,
    filters,
    activeTab,
    setActiveTab,
    setFilters,
    setPage,
    refetch,
    clearFilters,
  };
};
