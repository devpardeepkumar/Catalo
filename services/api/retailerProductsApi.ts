import apiClient from './apiClient';

export type RetailerProductsTab = 'featured' | 'pending' | 'unmatched';

export interface GetRetailerProductsParams {
  page?: number;
  limit?: number;
  tab?: RetailerProductsTab;
  search?: string;
  categoryId?: string;
}

export interface RetailerProductsResponse {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const retailerProductsApi = {
  getProducts: async (params: GetRetailerProductsParams = {}): Promise<RetailerProductsResponse> => {
    const { page = 1, limit = 20, tab, search, categoryId } = params;
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('limit', String(limit));
    if (tab) query.set('tab', tab);
    if (search) query.set('search', search);
    if (categoryId) query.set('categoryId', categoryId);
    const response = await apiClient.get(`/retailers/products?${query.toString()}`);
    const data = response.data?.data ?? response.data;
    return data;
  },
};
