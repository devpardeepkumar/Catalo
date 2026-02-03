import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { Product } from '../../types/product';
import { Table, TableAction, TableColumn } from './Table';
import { styles } from '../../styles/components/inventory/Table';

export type TabType = 'published' | 'to_be_published' | 'without_info';

interface TabContentRendererProps {
  activeTab: TabType;
  displayedProducts: Product[];
  loading?: boolean;
  tableColumns: TableColumn[];
  tableActions: TableAction[];
  onProductPress: (product: Product) => void;
}

export const TabContentRenderer: React.FC<TabContentRendererProps> = ({
  activeTab,
  displayedProducts,
  loading = false,
  tableColumns,
  tableActions,
  onProductPress,
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <View style={[styles.tableWrapper, { justifyContent: 'center', alignItems: 'center', minHeight: 200 }]}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={{ marginTop: 12, color: '#7F8C8D', fontSize: 14 }}>Loading products...</Text>
      </View>
    );
  }

  // Create columns for "to be published" section
  const toBePublishedColumns: TableColumn[] = [
    { key: 'image', title: 'Image', width: 80, type: 'image' },
    { key: 'name', title: 'Product Name', width: 150 },
    { key: 'description', title: 'Description', width: 250 },
    { key: 'quantity', title: 'Quantity', width: 80, type: 'quantity' },
    { key: 'price', title: 'Price', width: 80, type: 'price' },
    { key: 'brand', title: 'Brand', width: 100 },
  ];

  // Create actions for "to be published" section
  const toBePublishedActions: TableAction[] = [
    {
      key: 'edit',
      iconName: 'create-outline',
      onPress: (product: Product) => {
        router.push({
          pathname: '/screens/EditProductScreen',
          params: {
            id: product.id,
            name: product.name,
            image: product.image,
            price: (product.price ?? 0).toString(),
            category: product.category,
            brand: product.brand || '',
            quantity: (product.quantity ?? 0).toString(),
            views: (product.views ?? 0).toString(),
            clicks: (product.clicks ?? 0).toString(),
            bookings: (product.bookings ?? 0).toString(),
            ean: product.ean || '',
            manufacturerCode: product.manufacturerCode || '',
            description: product.description || '',
            internalCode: product.internalCode || '',
            discount: (product.discount ?? 0).toString(),
            discountDuration: product.discountDuration || '',
            // Add edit mode parameter for comprehensive editing
            editMode: 'full',
          },
        });
      },
     
    },
    {
      key: 'publish',
      iconName: 'send-outline',
      onPress: (product: Product) => {
        Alert.alert(
          'Publish Product',
          `Are you sure you want to publish "${product.name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Publish',
              style: 'default',
              onPress: () => {
                Alert.alert('Success', `${product.name} has been published.`);
              },
            },
          ]
        );
      },
      //style: { borderColor: '#28A745' },
    },
  ];

  switch (activeTab) {
    case 'published':
      return (
        <Table
          columns={tableColumns}
          data={displayedProducts}
          actions={tableActions}
          onRowPress={onProductPress}
          emptyMessage="No published products found"
        />
      );

    case 'to_be_published':
      return (
        <Table
          columns={toBePublishedColumns}
          data={displayedProducts}
          actions={toBePublishedActions}
          onRowPress={onProductPress}
          emptyMessage="No products to be published"
        />
      );

    case 'without_info':
      // Create columns for "without_info" section
      const withoutInfoColumns: TableColumn[] = [
        { key: 'image', title: 'Image', width: 80, type: 'image' },
        { key: 'name', title: 'Product Name', width: 150 },
        { key: 'ean', title: 'EAN', width: 120 },
        { key: 'brand', title: 'Brand', width: 100 },
        { key: 'quantity', title: 'Quantity', width: 80, type: 'quantity' },
        { key: 'price', title: 'Price', width: 80, type: 'price' },
      ];

      // Create actions for "without_info" section
      const withoutInfoActions: TableAction[] = [
        {
          key: 'add_info',
          iconName: 'create-outline',
          onPress: (product: Product) => {
            Alert.alert(
              'Add Product Info',
              `Add manufacturer information for "${product.name}"?`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Add Info',
                  style: 'default',
                  onPress: () => {
                    Alert.alert('Info Added', `Manufacturer info has been added for ${product.name}.`);
                  },
                },
              ]
            );
          },
          style: { backgroundColor: '#17A2B8' },
        },
        {
          key: 'delete',
          iconName: 'trash-outline',
          onPress: (product: Product) => {
            Alert.alert(
              'Delete Product',
              `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    Alert.alert('Deleted', `${product.name} has been deleted.`);
                  },
                },
              ]
            );
          },
          style: { backgroundColor: '#DC3545' },
        },
      ];

      return (
        <Table
          columns={withoutInfoColumns}
          data={displayedProducts}
          actions={withoutInfoActions}
          onRowPress={onProductPress}
          emptyMessage="No products"
        />
      );

    default:
      return null;
  }
};
