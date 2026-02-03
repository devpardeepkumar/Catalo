import { useCallback, useEffect, useRef, useState } from 'react';
import { Product } from '../types/product';
import { retailerProductsApi, RetailerProductsTab } from '../services/api/retailerProductsApi';

export type InventoryTab = 'published' | 'to_be_published' | 'without_info';

/** Map UI tab to API tab param: published → featured, to_be_published → pending, without_info → unmatched */
function getApiTabForInventoryTab(activeTab: InventoryTab): RetailerProductsTab {
  switch (activeTab) {
    case 'published':
      return 'featured';
    case 'to_be_published':
      return 'pending';
    case 'without_info':
      return 'unmatched';
    default:
      return 'unmatched';
  }
}

/** Map API retailer product item to frontend Product (handles camelCase and snake_case from API) */
function mapRetailerProductToProduct(item: any): Product {
  const product = item.product;
  const categoryName = product?.category?.name ?? (typeof product?.category === 'string' ? product.category : 'Imported');
  const name = product?.name ?? item.productName ?? item.product_name ?? 'Unknown';
  const image = item.primaryImageUrl ?? item.primary_image_url ?? product?.image ?? 'https://dummyimage.com/300';
  const price = Number(item.price ?? 0);
  const quantity = item.quantity ?? 0;
  const ean = item.ean ?? product?.ean;
  const manufacturerCode = item.manufacturerCode ?? item.manufacturer_code ?? product?.manufacturerCode ?? product?.manufacturer_code;
  const brand = item.brand ?? product?.brand;
  const discountedPrice = item.discountedPrice ?? item.discounted_price;
  return {
    id: item.id,
    name,
    image,
    price,
    category: categoryName,
    quantity,
    ean,
    manufacturerCode,
    brand,
    description: product?.description,
    internalCode: product?.internalCode ?? product?.internal_code,
    discount: discountedPrice != null ? Number(discountedPrice) : undefined,
    discountDuration: product?.discountDuration ?? product?.discount_duration,
    views: product?.views,
    clicks: product?.clicks,
    bookings: product?.bookings,
  };
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFiltersState] = useState<InventoryFilters>({});
  const [activeTab, setActiveTab] = useState<InventoryTab>('published');

  const prevActiveTabRef = useRef<InventoryTab>(activeTab);

  const fetchProducts = useCallback(async (tab: InventoryTab, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const apiTab = getApiTabForInventoryTab(tab);
      const result = await retailerProductsApi.getProducts({
        page,
        limit: itemsPerPage,
        tab: apiTab,
        search: filters.search,
        categoryId: filters.category,
      });
      console.log('Retailer products API response (tab:', apiTab, '):', result);
      const list = Array.isArray(result?.products) ? result.products : [];
      setProducts(list.map(mapRetailerProductToProduct));
      const pagination = result?.pagination;
      if (pagination?.totalPages != null) {
        setTotalPages(pagination.totalPages);
      } else if (pagination?.total != null) {
        setTotalPages(Math.ceil(pagination.total / itemsPerPage) || 1);
      } else {
        setTotalPages(1);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? 'Failed to fetch products');
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, filters.search, filters.category]);

  useEffect(() => {
    if (prevActiveTabRef.current !== activeTab) {
      prevActiveTabRef.current = activeTab;
      setCurrentPage(1);
      return;
    }
    fetchProducts(activeTab, currentPage);
  }, [activeTab, currentPage, fetchProducts]);

  const shouldPaginate = totalPages > 1;
  const filteredProducts = products;

  const setFilters = (newFilters: Partial<InventoryFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const refetch = async () => {
    await fetchProducts(activeTab, currentPage);
  };

  const clearFilters = () => {
    setFiltersState({});
    setCurrentPage(1);
  };

  return {
    products,
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
