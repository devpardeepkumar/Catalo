import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { dummyProducts } from '../data/products';
import { Product } from '../types/product';

const PRODUCTS_STORAGE_KEY = 'imported_products';

interface ProductsContextType {
  products: Product[];
  updateProduct: (updatedProduct: Product) => void;
  addProducts: (newProducts: Product[]) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from AsyncStorage on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProductsStr = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (storedProductsStr) {
          const storedProducts = JSON.parse(storedProductsStr);
          // Merge stored products with dummy products (avoid duplicates)
          const existingIds = new Set(dummyProducts.map(p => p.id));
          const newStoredProducts = storedProducts.filter((p: Product) => !existingIds.has(p.id));
          setProducts([...dummyProducts, ...newStoredProducts]);
        } else {
          setProducts(dummyProducts);
        }
      } catch (error) {
        console.error('Error loading products from storage:', error);
        setProducts(dummyProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Save products to AsyncStorage whenever products change
  useEffect(() => {
    if (!isLoading) {
      const saveProducts = async () => {
        try {
          // Only save imported products (not dummy products)
          const importedProducts = products.filter(p => p.id.startsWith('imported-'));
          await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(importedProducts));
        } catch (error) {
          console.error('Error saving products to storage:', error);
        }
      };

      saveProducts();
    }
  }, [products, isLoading]);

  const updateProduct = (updatedProduct: Product) => {
    setProducts(currentProducts =>
      currentProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const addProducts = (newProducts: Product[]) => {
    setProducts(currentProducts => [...currentProducts, ...newProducts]);
  };

  return (
    <ProductsContext.Provider value={{ products, updateProduct, addProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};
