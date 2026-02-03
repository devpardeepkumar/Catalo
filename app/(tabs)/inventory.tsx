import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { ManualProductModal } from '../../components/common/ManualProductModal';
import { ActionButton } from '../../components/inventory/ActionButtonsRow';
import { ColumnMapping, ColumnMappingSection } from '../../components/inventory/ColumnMappingSection';
import { CsvUploadSection } from '../../components/inventory/CsvUploadSection';
import { ImportSuccessScreen } from '../../components/inventory/ImportSuccessScreen';
import { InventoryLayout } from '../../components/inventory/InventoryLayout';
import { PaginationControls } from '../../components/inventory/PaginationControls';
import { TabContentRenderer } from '../../components/inventory/TabContentRenderer';
import { TableAction, TableColumn } from '../../components/inventory/Table';
import { TabType } from '../../components/inventory/TabNavigation';
import { useProducts } from '../../context/ProductsContext';
import { useInventory } from '../../hooks/useInventory';
import { styles } from '../../styles/tabs/inventory';
import { ManualProductForm, ProductSheet } from '../../types/manualProduct';
import { Product } from '../../types/product';
// @ts-ignore - papaparse types may not be available
import Papa from 'papaparse';

type InventoryTabType = TabType;

type CsvUploadStep = 'file-selection' | 'column-mapping' | 'success';

export default function InventoryScreen() {
  const [csvUploadStep, setCsvUploadStep] = useState<CsvUploadStep | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileAsset, setSelectedFileAsset] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [csvSampleRows, setCsvSampleRows] = useState<any[]>([]);
  const [updateOnlyExisting, setUpdateOnlyExisting] = useState(false);
  const [matchedItemsCount, setMatchedItemsCount] = useState(0);
  const [totalProcessedCount, setTotalProcessedCount] = useState(0);
  const [duplicatesSkippedCount, setDuplicatesSkippedCount] = useState(0);
  const [importedProducts, setImportedProducts] = useState<Product[]>([]);
  const [showManualProductModal, setShowManualProductModal] = useState(false);
  const router = useRouter();
  const { addProducts, products: allProducts } = useProducts();
  const {
    products: displayedProducts,
    loading,
    error,
    activeTab,
    setActiveTab,
    totalPages,
    currentPage,
    shouldPaginate,
    setPage,
    refetch,
  } = useInventory();

  // Table configuration
  const tableColumns: TableColumn[] = [
    { key: 'image', title: 'Image', width: 80 },
    { key: 'name', title: 'Product Name', width: 150 },
    { key: 'ean', title: 'EAN', width: 120 },
    { key: 'manufacturerCode', title: 'Mfr Code', width: 100 },
    { key: 'brand', title: 'Brand', width: 100 },
    { key: 'description', title: 'Description', width: 200 },
    { key: 'internalCode', title: 'Internal Code', width: 120 },
    { key: 'quantity', title: 'Quantity', width: 80 },
    { key: 'price', title: 'Price', width: 80 },
    { key: 'discount', title: 'Discount', width: 80 },
    { key: 'discountDuration', title: 'Discount Duration', width: 120 },
  ];

  const tableActions: TableAction[] = [
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
          },
        });
      },
      style: styles.tableEditButton,
    },
    {
      key: 'unpublish',
      iconName: 'eye-off-outline',
      onPress: (product: Product) => {
    Alert.alert(
      'Unpublish Product',
      `Are you sure you want to unpublish "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unpublish', style: 'destructive' },
      ]
    );
      },
      style: styles.tableUnpublishButton,
    },
    {
      key: 'details',
      iconName: 'information-circle-outline',
      onPress: (product: Product) => {
    router.push({
      pathname: '/screens/ProductDetailsScreen',
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
        description: `This is a detailed description for ${product.name}. It includes all the relevant information about the product specifications, features, and usage.`,
        isGeolocated: 'true',
        lastUpdated: new Date().toISOString(),
      },
    });
      },
      style: styles.tableDetailsButton,
    },
  ];

  // Action buttons configuration
  const actionButtons: ActionButton[] = [
    {
      id: 'add-new',
      title: 'Add New',
      iconName: 'add-circle-outline',
      onPress: () => {
        setShowManualProductModal(true);
      },
    },
    
    {
      id: 'upload-csv',
      title: 'Upload CSV',
      iconName: 'cloud-upload-outline',
      onPress: () => {
        setCsvUploadStep('file-selection');
        setMatchedItemsCount(0);
        setTotalProcessedCount(0);
        setDuplicatesSkippedCount(0);
      },
    },
    {
      id: 'download',
      title: 'Download',
      iconName: 'download-outline',
      onPress: () => {
        Alert.alert('Download Data', 'Download functionality will be implemented here. This could export product data to CSV, PDF, etc.');
      },
    },
  ];

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/screens/ProductDetailsScreen',
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
        description: `This is a detailed description for ${product.name}. It includes all the relevant information about the product specifications, features, and usage.`,
        isGeolocated: 'true',
        lastUpdated: new Date().toISOString(),
      },
    });
  };

  const renderContent = () => (
    <TabContentRenderer
      activeTab={activeTab}
      displayedProducts={displayedProducts}
      loading={loading}
      tableColumns={tableColumns}
      tableActions={tableActions}
      onProductPress={handleProductPress}
    />
  );

  const handleFileSelect = (fileName: string | null, asset: DocumentPicker.DocumentPickerAsset | null) => {
    setSelectedFile(fileName);
    setSelectedFileAsset(asset);
  };

  const handleCsvNext = (headers: string[], sampleRows: any[], uploadId: string) => {
    console.log('handleCsvNext received uploadId:', uploadId);
    setCsvHeaders(headers);
    setUploadId(uploadId);
    setCsvSampleRows(sampleRows);
    setCsvUploadStep('column-mapping');
  };

  const handleColumnMappingBack = () => {
    setCsvUploadStep('file-selection');
  };

  const handleProcessUpload = async (mappings: ColumnMapping[]) => {
    if (!selectedFileAsset) {
      Alert.alert('Error', 'No file selected');
      return;
    }

    // Filter out unmapped columns
    const validMappings = mappings.filter((m) => m.platformField !== null);
    
    if (validMappings.length === 0) {
      Alert.alert('Error', 'Please map at least one column to a platform field');
      return;
    }

    try {
      // Read the CSV file content
      const response = await fetch(selectedFileAsset.uri);
      const text = await response.text();

      // Parse CSV
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          if (results.errors && results.errors.length > 0) {
            Alert.alert('Error', 'Failed to parse CSV file. Please check the file format.');
            return;
          }

          // Create a mapping from CSV header to platform field
          const headerToFieldMap: Record<string, string> = {};
          validMappings.forEach((mapping) => {
            if (mapping.platformField) {
              headerToFieldMap[mapping.csvHeader] = mapping.platformField;
            }
          });

          // Convert CSV rows to products
          const newProducts: Product[] = [];
          const csvData = results.data || [];

          csvData.forEach((row: any, index: number) => {
            const product: Partial<Product> = {
              id: `imported-${Date.now()}-${index}`,
              image: 'https://dummyimage.com/300',
              category: 'Imported',
              // Mark as "to be published" by having empty or short description
              description: '',
            };

            // Map CSV columns to product fields
            Object.keys(headerToFieldMap).forEach((csvHeader) => {
              const platformField = headerToFieldMap[csvHeader];
              const value = row[csvHeader];

              if (value !== undefined && value !== null && value !== '') {
                switch (platformField) {
                  case 'name':
                    product.name = String(value);
                    break;
                  case 'ean':
                    product.ean = String(value);
                    break;
                  case 'manufacturerCode':
                    product.manufacturerCode = String(value);
                    break;
                  case 'internalCode':
                    product.internalCode = String(value);
                    break;
                  case 'brand':
                    product.brand = String(value);
                    break;
                  case 'quantity':
                    product.quantity = parseInt(String(value), 10) || 0;
                    break;
                  case 'price':
                    product.price = parseFloat(String(value)) || 0;
                    break;
                  case 'discount':
                    product.discount = parseFloat(String(value)) || 0;
                    break;
                  case 'discountDuration':
                    product.discountDuration = String(value);
                    break;
                }
              }
            });

            // Ensure required fields are present
            if (product.name) {
              newProducts.push(product as Product);
            }
          });

          // Check for duplicates and filter them out
          if (newProducts.length > 0) {
            // Get existing products for duplicate checking
            const existingProducts = allProducts;

            // Process products: handle duplicates by adding them to "without_info" section
            const processedProducts: Product[] = [];
            const duplicateProducts: Product[] = [];

            newProducts.forEach(newProduct => {
              // Skip if no name (required field)
              if (!newProduct.name) return;

              // Check for existing product with same name and EAN (exact match)
              const exactDuplicate = existingProducts.some(existingProduct => {
                const nameMatch = existingProduct.name?.toLowerCase().trim() === newProduct.name?.toLowerCase().trim();
                const eanMatch = existingProduct.ean && newProduct.ean &&
                  existingProduct.ean.replace(/\s/g, '') === newProduct.ean.replace(/\s/g, '');
                return nameMatch && eanMatch;
              });

              if (exactDuplicate) {
                console.log(`Found exact duplicate, adding to without_info section: ${newProduct.name} (EAN: ${newProduct.ean})`);
                // Create a duplicate version for "without_info" section
                const duplicateVersion: Product = {
                  ...newProduct,
                  id: `duplicate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  manufacturerCode: undefined, // This makes it appear in "without_info" section
                  quantity: 0, // Set quantity to 0 so it doesn't appear in "published" section
                  category: 'Duplicate - Needs Review',
                  description: `DUPLICATE: This product already exists in the system. Please review and merge if needed. Original: ${newProduct.description || 'No description'}`,
                  // Mark it as duplicate for easy identification
                  internalCode: `DUPLICATE-${newProduct.internalCode || ''}`,
                };
                duplicateProducts.push(duplicateVersion);
                return;
              }

              // Check for potential conflicts (same EAN, different name)
              const eanConflict = existingProducts.some(existingProduct => {
                return existingProduct.ean && newProduct.ean &&
                       existingProduct.ean.replace(/\s/g, '') === newProduct.ean.replace(/\s/g, '') &&
                       existingProduct.name?.toLowerCase().trim() !== newProduct.name?.toLowerCase().trim();
              });

              if (eanConflict) {
                console.warn(`EAN conflict detected for: ${newProduct.name} (EAN: ${newProduct.ean}) - EAN already exists with different name`);
                // Still allow import but log the warning
              }

              processedProducts.push(newProduct);
            });

            // Combine regular products and duplicate products
            const allProductsToAdd = [...processedProducts, ...duplicateProducts];

            if (allProductsToAdd.length > 0) {
              addProducts(allProductsToAdd);
              setImportedProducts(allProductsToAdd);
              setMatchedItemsCount(processedProducts.length); // Only count truly new products
              setTotalProcessedCount(newProducts.length);
              setDuplicatesSkippedCount(duplicateProducts.length); // Duplicates are now added to without_info

              // Show appropriate message based on results
              const totalProcessed = newProducts.length;
              const newProductsCount = processedProducts.length;
              const duplicatesCount = duplicateProducts.length;

              if (duplicatesCount === 0) {
                Alert.alert(
                  'Import Successful',
                  `${newProductsCount} products imported successfully.`,
                  [{ text: 'OK' }]
                );
              } else if (newProductsCount === 0) {
                Alert.alert(
                  'Duplicates Added for Review',
                  `All ${duplicatesCount} products from your CSV were duplicates. They have been added to the "No Product Info" section for review.`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Import Complete',
                  `Processed ${totalProcessed} products:\n• ${newProductsCount} new products imported\n• ${duplicatesCount} duplicates added to "No Product Info" section for review`,
                  [{ text: 'OK' }]
                );
              }

              setCsvUploadStep('success');
            } else if (processedProducts.length === 0 && duplicateProducts.length > 0) {
              // All products were duplicates - they are now in without_info section
              setCsvUploadStep('success');
            } else {
              Alert.alert('Error', 'No valid products found in CSV file');
            }
          } else {
            Alert.alert('Error', 'No valid products found in CSV file');
          }
        },
        error: (error: any) => {
          Alert.alert('Error', `Failed to parse CSV: ${error?.message || 'Unknown error'}`);
        },
      });
    } catch (error) {
      console.error('Error processing CSV:', error);
      Alert.alert('Error', 'Failed to process CSV file. Please try again.');
    }
  };

  const handleSeeArticles = () => {
    // Switch to "To be published" tab and close the upload flow
    // The imported products are already added to context and will show in the tab
    setActiveTab('to_be_published');
    setCsvUploadStep(null);
    setSelectedFile(null);
    setSelectedFileAsset(null);
    setCsvHeaders([]);
    setUpdateOnlyExisting(false);
    setMatchedItemsCount(0);
    setImportedProducts([]);
  };

  const handleCsvCancel = () => {
    setCsvUploadStep(null);
    setSelectedFile(null);
    setSelectedFileAsset(null);
    setCsvHeaders([]);
    setUpdateOnlyExisting(false);
    setMatchedItemsCount(0);
    setTotalProcessedCount(0);
    setDuplicatesSkippedCount(0);
  };

  const renderCsvUpload = () => {
    if (csvUploadStep === 'success') {
      return (
        <ImportSuccessScreen
          matchedItemsCount={matchedItemsCount}
          totalProcessed={totalProcessedCount}
          duplicatesSkipped={duplicatesSkippedCount}
          onSeeArticles={handleSeeArticles}
        />
      );
    }

    if (csvUploadStep === 'column-mapping') {
      console.log('renderCsvUpload passing uploadId to ColumnMappingSection:', uploadId);
      return (
        <ColumnMappingSection
          csvHeaders={csvHeaders}
          uploadId={uploadId || ''}
          sampleRows={csvSampleRows}
          updateOnlyExisting={updateOnlyExisting}
          onBack={handleColumnMappingBack}
          onProcessUpload={handleProcessUpload}
        />
      );
    }

    return (
      <CsvUploadSection
        selectedFile={selectedFile}
        selectedFileAsset={selectedFileAsset}
        updateOnlyExisting={updateOnlyExisting}
        onFileSelect={handleFileSelect}
        onUpdateOnlyChange={setUpdateOnlyExisting}
        onCancel={handleCsvCancel}
        onNext={handleCsvNext}
      />
    );
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (csvUploadStep !== 'success') {
      setCsvUploadStep(null);
    }
  };

  const handleManualProductSave = (productData: ManualProductForm & { productSheet?: ProductSheet; image?: string; description?: string }) => {
    // Create a new product object
    const newProduct: Product = {
      id: Date.now().toString(), // Temporary ID - replace with proper ID generation
      name: productData.productName || productData.productSheet?.name || 'Unnamed Product',
      image: productData.image || productData.productSheet?.images[0] || 'https://dummyimage.com/300',
      price: parseFloat(productData.price) || 0,
      category: productData.productSheet?.category || 'Uncategorized',
      brand: productData.brand || productData.productSheet?.brand,
      quantity: parseInt(productData.quantity) || 0,
      internalCode: productData.internalCode,
      ean: productData.ean.replace(/\s/g, ''), // Clean EAN
      manufacturerCode: productData.manufacturerCode,
      description: (productData.description && productData.description.trim()) || productData.productSheet?.description,
      discount: parseFloat(productData.discount) || undefined,
      discountDuration: productData.discountDuration || undefined,
    };

    // Add the product to the context
    addProducts([newProduct]);

    // Show success message
    Alert.alert('Success', 'Product added successfully!');

    // Navigate to appropriate page based on whether product sheet was found
    if (productData.productSheet) {
      setActiveTab('published'); // Page 1 - Published products
    } else {
      setActiveTab('without_info'); // Page 3 - Products without info
    }
  };

  const renderCurrentContent = () => {
    return csvUploadStep ? renderCsvUpload() : renderContent();
  };

  return (
    <>
      <InventoryLayout
        activeTab={activeTab}
        actionButtons={actionButtons}
        onTabChange={handleTabChange}
        paginationControls={
          shouldPaginate && !csvUploadStep ? (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : null
        }
      >
        {renderCurrentContent()}
      </InventoryLayout>

      <ManualProductModal
        visible={showManualProductModal}
        onClose={() => setShowManualProductModal(false)}
        onSave={handleManualProductSave}
      />
    </>
  );
}


