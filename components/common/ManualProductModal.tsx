import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import apiClient from '../../services/api/apiClient';
import { styles } from '../../styles/components/manualProduct.styles';
import {
  ManualProductForm,
  ManualProductState,
  ProductMatch,
  ProductSheet,
} from '../../types/manualProduct.types';

interface ManualProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (product: ManualProductForm & { productSheet?: ProductSheet }) => void;
  initialData?: Partial<ManualProductForm>;
}

// Helper functions
const validateEAN = (ean: string): boolean =>
  /^\d{8,18}$/.test(ean.replace(/\s/g, ''));

const formatEAN = (ean: string): string =>
  ean.replace(/\s/g, '').replace(/(\d{1,4})/g, '$1 ').trim();

const createProductSheet = (match: ProductMatch): ProductSheet => ({
  id: match.id,
  name: match.name,
  brand: match.brand,
  images: [match.image],
  description: match.description,
  category: match.category,
  specs: match.specs,
  manufacturerName: match.manufacturerName,
});

  const getInitialState = (initialData?: Partial<ManualProductForm>): ManualProductState => ({
  step: 'initial',
  form: {
    ean: initialData?.ean || '',
    manufacturerCode: initialData?.manufacturerCode || '',
    brand: initialData?.brand || '',
    productName: initialData?.productName || '',
    internalCode: initialData?.internalCode || '',
    quantity: initialData?.quantity || '',
    price: initialData?.price || '',
    discount: initialData?.discount || '',
    discountDuration: initialData?.discountDuration || '',
    description: initialData?.description || '',
    image: initialData?.image || '',
  },
  matches: [],
  productSheet: null,
  isLoading: false,
  error: null,
  searchCompleted: false,
});

const mockAPISearch = async (ean: string, manufacturerCode?: string): Promise<ProductMatch[]> => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

  // Enhanced matching logic considering both EAN and Manufacturer Code
  const hasManufacturerCode = manufacturerCode && manufacturerCode.trim().length > 0;

  if (ean === '1234567890123' && (!hasManufacturerCode || manufacturerCode === 'ATHP001')) {
    return [{
      id: '1',
      name: hasManufacturerCode ? 'Wireless Headphones Pro - ' + manufacturerCode : 'Wireless Headphones Pro',
      brand: 'AudioTech',
      manufacturerName: 'TechCorp',
      image: 'https://via.placeholder.com/100',
      specs: {
        'Battery Life': '30h',
        'Connectivity': 'Bluetooth 5.0',
        'Model': hasManufacturerCode ? manufacturerCode : 'Unknown'
      },
      category: 'Electronics',
      description: hasManufacturerCode
        ? 'Premium wireless headphones (Model: ' + manufacturerCode + ') with noise cancellation.'
        : 'Premium wireless headphones with noise cancellation.',
    }];
  }

  return [];
};

const pickImage = async (setImage: (image: string) => void) => {
  Alert.alert(
    'Select Image',
    'Choose how you want to add a product image',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Take Photo',
        onPress: () => launchCamera(setImage),
      },
      {
        text: 'Choose from Gallery',
        onPress: () => launchGallery(setImage),
      },
    ]
  );
};

const launchCamera = async (setImage: (image: string) => void) => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  } catch (error) {
    console.error('Camera error:', error);
    Alert.alert('Error', 'Failed to take photo. Please try again.');
  }
};

const launchGallery = async (setImage: (image: string) => void) => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  } catch (error) {
    console.error('Gallery error:', error);
    Alert.alert('Error', 'Failed to select image. Please try again.');
  }
};

export const ManualProductModal: React.FC<ManualProductModalProps> = ({
  visible,
  onClose,
  onSave,
  initialData,
}) => {
  const [state, setState] = useState<ManualProductState>(() => getInitialState(initialData));
  const [autoSearchPending, setAutoSearchPending] = useState(false);
  const [imagePressed, setImagePressed] = useState(false);


  const updateState = (updates: Partial<ManualProductState>) =>
    setState(prev => ({ ...prev, ...updates }));

  const resetState = () => { setState(getInitialState(initialData)); setAutoSearchPending(false); };
  const handleClose = () => { resetState(); onClose(); };

  const handleEANChange = (text: string) => {
    const formatted = formatEAN(text);
    const cleanEAN = formatted.replace(/\s/g, '');
    const oldEAN = state.form.ean.replace(/\s/g, '');
    
    // Reset search if EAN changed
    if (cleanEAN !== oldEAN) {
      updateState({
        form: { ...state.form, ean: formatted },
        error: null,
        searchCompleted: false,
        productSheet: null,
        matches: []
      });
    } else {
      updateState({ form: { ...state.form, ean: formatted }, error: null });
    }
    
    // Auto-search when EAN reaches valid length
    if (cleanEAN.length >= 8 && cleanEAN.length <= 18) {
      setAutoSearchPending(true);
      setTimeout(() => setState(current => {
        if (current.form.ean.replace(/\s/g, '') === cleanEAN && !current.isLoading) searchProduct();
        return current;
      }), 800);
      setTimeout(() => setAutoSearchPending(false), 800);
    }
  };

  const searchProduct = async (): Promise<ProductMatch[]> => {
    const cleanEAN = state.form.ean.replace(/\s/g, '');
    if (!validateEAN(cleanEAN)) {
      updateState({ error: 'Please enter a valid EAN (8-18 digits)' });
      return [];
    }
    updateState({ isLoading: true, error: null });
    try {
      const matches = await mockAPISearch(cleanEAN, state.form.manufacturerCode);
      // Store results and create product sheet if matches found
      updateState({
        ...(matches.length > 0 && { productSheet: createProductSheet(matches[0]) }),
        matches,
        isLoading: false,
        searchCompleted: true
      });
      return matches;
    } catch {
      updateState({ error: 'Failed to search for product. Please try again.', isLoading: false, searchCompleted: false });
      return [];
    }
  };

  const handleBack = () => {
    updateState({ step: 'initial' });
  };

  const handleNext = async () => {
    if (state.isLoading) return;
    
    // Validate required fields before moving to next step
    if (!state.form.ean.trim()) {
      Alert.alert('Error', 'EAN is required');
      return;
    }
    if (!state.form.manufacturerCode.trim()) {
      Alert.alert('Error', 'Manufacturer Product Code is required');
      return;
    }

    // If search hasn't been performed, perform it first
    if (!state.searchCompleted) {
      await searchProduct();
    }

    // Move to confirmation step
    updateState({ step: 'confirmation' });
  };


  const handleSave = async () => {
    alert('check ')
    if (!state.form.ean.trim()) return Alert.alert('Error', 'EAN is required');
    if (!state.form.manufacturerCode.trim()) {
      return Alert.alert('Error', 'Manufacturer Product Code is required for proper product identification');
    }
    alert('check 1')
    if (state.step === 'confirmation' && !state.productSheet &&
        (!state.form.brand.trim() || !state.form.productName.trim())) {
      return Alert.alert('Error', 'Brand and Product Name are required when no product sheet is found');
    }
    alert('check 2')
    // Prepare data for API call
    const cleanEAN = state.form.ean.replace(/\s/g, '');
    const quantity = parseFloat(state.form.quantity);
    const price = parseFloat(state.form.price);

    if (isNaN(quantity) || quantity <= 0) {
      return Alert.alert('Error', 'Quantity must be a positive number.');
    }

    if (isNaN(price) || price <= 0) {
      return Alert.alert('Error', 'Price must be a positive number.');
    }

    const discount = parseFloat(state.form.discount) || 0;
    alert('check 3')
    // Calculate discounted price (price minus discount amount)
    const discountedPrice = price - discount;
    alert('check 4')
    const apiData = {
      ean: cleanEAN,
      quantity: quantity,
      price: price,
      sku: state.form.internalCode || '',
      discountedPrice: discountedPrice > 0 ? discountedPrice : price,
    };
    alert('check 5')
console.log('apiData', apiData)
    updateState({ isLoading: true, error: null });

    try {
      const response = await apiClient.post('/retailers/inventory/manual', apiData);
console.log('----response---', response);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'OMG successfully!', [
          { text: 'OK', onPress: () => {
            onSave({ ...state.form, productSheet: state.productSheet || undefined });
            handleClose();
          }}
        ]);
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product. Please try again.';
      updateState({ error: errorMessage, isLoading: false });

      Alert.alert('Error', errorMessage);
    } finally {
      updateState({ isLoading: false });
    }
  };

  // Inline field renderer
  const field = (label: string, value: string, onChange: (text: string) => void, placeholder: string, required = false) => (
    <View key={label} style={styles.inputGroup}>
      <Text style={[styles.inputLabel, required && styles.inputLabelRequired]}>
        {label}{required ? ' *' : ''}
      </Text>
      <TextInput style={styles.textInput} value={value} onChangeText={onChange} placeholder={placeholder} />
    </View>
  );

  const renderContent = () => {
    if (state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Searching for product...</Text>
        </View>
      );
    }

    if (state.step === 'initial') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          <View style={styles.inputGroup}>
            {/* <Text style={[styles.inputLabel, styles.inputLabelRequired]}>EAN</Text> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.textInput, styles.eanInput, { flex: 1 }]}
                value={state.form.ean}
                onChangeText={handleEANChange}
                placeholder="Enter EAN code"
                keyboardType="numeric"
                maxLength={23}
              />
              <TouchableOpacity
                style={[styles.searchButton, autoSearchPending && styles.searchButtonPending]}
                onPress={searchProduct}
                disabled={state.isLoading || autoSearchPending}
              >
                <Text style={styles.searchButtonText}>
                  {state.isLoading ? '...' : autoSearchPending ? 'Searching...' : 'Search'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputGroup}>
            {/* <Text style={[styles.inputLabel, styles.inputLabelRequired, styles.manufacturerCodeLabel]}>
              Manufacturer Product Code 
            </Text> */}
            <TextInput
              style={[styles.textInput, styles.manufacturerCodeInput]}
              value={state.form.manufacturerCode}
              onChangeText={(text: string) => {
                const oldCode = state.form.manufacturerCode;
                setState(prev => ({
                  ...prev,
                  form: { ...prev.form, manufacturerCode: text },
                  // Reset search if manufacturer code changed
                  ...(text !== oldCode && {
                    searchCompleted: false,
                    productSheet: null,
                    matches: []
                  })
                }));
              }}
              placeholder="Enter manufacturer's product code"
              autoCapitalize="characters"
            />
            <Text style={styles.manufacturerCodeHint}>
              🔑 Required for accurate product identification and catalog matching
            </Text>
          </View>
        </View>
      );
    }


    // confirmation step
    return (
      <>
        {state.productSheet && (
          <View style={styles.productSheet}>
            <Text style={styles.productSheetTitle}>Product Sheet Found</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productImages}>
              {state.productSheet.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.productImage} />
              ))}
            </ScrollView>
            <Text style={styles.productDescription}>{state.productSheet.description}</Text>
            {Object.entries(state.productSheet.specs).map(([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specLabel}>{key}:</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>Retailer Information</Text> */}
          {!state.productSheet && (
            <>
              {field('Brand', state.form.brand, (text) => setState(prev => ({
                ...prev,
                form: { ...prev.form, brand: text }
              })), 'Enter brand name', true)}
              {field('Product Name', state.form.productName, (text) => setState(prev => ({
                ...prev,
                form: { ...prev.form, productName: text }
              })), 'Enter product name', true)}
            </>
          )}
          {field('Internal Code', state.form.internalCode, (text) => setState(prev => ({
            ...prev,
            form: { ...prev.form, internalCode: text }
          })), 'Your internal SKU')}
          {field('Quantity', state.form.quantity, (text) => setState(prev => ({
            ...prev,
            form: { ...prev.form, quantity: text }
          })), '0')}
          {field('Price (€)', state.form.price, (text) => setState(prev => ({
            ...prev,
            form: { ...prev.form, price: text }
          })), '0.00')}

          {/* Product Image Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Product Image</Text>
            
            <TouchableOpacity
              style={styles.imageUploadButton}
              activeOpacity={0.8}
              onPress={() => {
                pickImage((imageUri) => {
                  console.log('Image picker returned URI:', imageUri);
                  if (imageUri) {
                    console.log('Updating state with image URI:', imageUri);
                    setState(prev => {
                      const newState = {
                        ...prev,
                        form: { ...prev.form, image: imageUri }
                      };
                      console.log('New state image value:', newState.form.image);
                      return newState;
                    });
                  } else {
                    console.log('No image URI returned from picker');
                  }
                });
              }}
              onPressIn={() => setImagePressed(true)}
              onPressOut={() => setImagePressed(false)}
            >
              {state.form.image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    key={state.form.image}
                    source={{ uri: state.form.image }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                    onError={(error: any) => {
                      console.log('Image load error:', error);
                      console.log('Failed URI:', state.form.image);
                      Alert.alert('Error', 'Failed to load image. Please try again.');
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully!');
                      console.log('Image URI:', state.form.image);
                    }}
                  />
                  {imagePressed && (
                    <View style={styles.imageOverlay}>
                      <Ionicons name="camera" size={24} color="#FFF" />
                      <Text style={styles.imageOverlayText}>Change Image</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.imageUploadPlaceholder}>
                  <Ionicons name="camera" size={48} color="#BDC3C7" />
                  <Text style={styles.imageUploadText}>Tap to add product image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {field('Description', state.form.description, (text) => setState(prev => ({
            ...prev,
            form: { ...prev.form, description: text }
          })), 'Enter product description')}
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={handleClose}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalContainer}
        onPress={handleClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContent}
          onPress={(e: any) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add New Product</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color="#34495E" />
            </TouchableOpacity>
          </View>
          <View style={styles.stepIndicator}>
            {['initial', 'confirmation'].map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = step === 'initial' && state.step === 'confirmation';
              const isActive = state.step === step;
              const isPending = !isCompleted && !isActive;

              return (
                <View key={step} style={styles.stepContainer}>
                  <View style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCompleted,
                    isActive && styles.stepActive,
                    isPending && styles.stepPending
                  ]}>
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    ) : (
                      <Text style={[
                        styles.stepNumber,
                        isActive && styles.stepNumberActive,
                        isPending && styles.stepNumberPending
                      ]}>
                        {stepNumber}
                      </Text>
                    )}
                  </View>
                  {index < 1 && (
                    <View style={[
                      styles.stepLine,
                      state.step === 'confirmation' && styles.stepLineCompleted
                    ]} />
                  )}
                </View>
              );
            })}
          </View>
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {state.error && <View style={styles.errorContainer}><Text style={styles.errorText}>{state.error}</Text></View>}
            {renderContent()}
          </ScrollView>
          <View style={styles.actionButtons}>
            {state.step === 'initial' ? (
              <>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleClose}>
                  <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={handleNext}
                  disabled={state.isLoading}
                >
                  <Text style={styles.actionButtonText}>
                    {state.isLoading ? 'Searching...' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleBack}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="arrow-back" size={16} color="#34495E" style={{ marginRight: 4 }} />
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Back</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleSave}>
                  <Text style={styles.actionButtonText}>Save Product</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
