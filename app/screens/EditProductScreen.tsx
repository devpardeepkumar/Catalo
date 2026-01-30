import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts } from '../../context/ProductsContext';
import { styles } from '../../styles/screens/editProduct';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  brand?: string;
  quantity?: number;
  views?: number;
  clicks?: number;
  bookings?: number;
  ean?: string;
  manufacturerCode?: string;
  description?: string;
  internalCode?: string;
  discount?: number;
  discountDuration?: string;
}

export default function EditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateProduct } = useProducts();

  // Check edit mode - 'full' allows editing all fields, 'limited' is default
  const editMode = (params.editMode as string) || 'limited';
  const isFullEdit = editMode === 'full';

  // Parse the product data from params
  const product: Product = {
    id: params.id as string,
    name: params.name as string,
    image: params.image as string,
    price: parseFloat(params.price as string),
    category: params.category as string,
    brand: params.brand as string,
    quantity: params.quantity ? parseInt(params.quantity as string) : undefined,
    views: params.views ? parseInt(params.views as string) : undefined,
    clicks: params.clicks ? parseInt(params.clicks as string) : undefined,
    bookings: params.bookings ? parseInt(params.bookings as string) : undefined,
    ean: params.ean as string,
    manufacturerCode: params.manufacturerCode as string,
    description: params.description as string,
    internalCode: params.internalCode as string,
    discount: params.discount ? parseInt(params.discount as string) : undefined,
    discountDuration: params.discountDuration as string,
  };

  // Form state
  const [internalCode, setInternalCode] = useState<string>(product.internalCode || '');
  const [quantity, setQuantity] = useState<string>(product.quantity?.toString() || '');
  const [price, setPrice] = useState<string>(product.price.toString());
  const [discount, setDiscount] = useState<string>(product.discount?.toString() || '');
  const [discountDuration, setDiscountDuration] = useState<string>(product.discountDuration || '');

  // Additional fields for full edit mode
  const [productName, setProductName] = useState<string>(product.name);
  const [brand, setBrand] = useState<string>(product.brand || '');
  const [manufacturerCode, setManufacturerCode] = useState<string>(product.manufacturerCode || '');
  const [ean, setEan] = useState<string>(product.ean || '');
  const [description, setDescription] = useState<string>(product.description || '');
  const [category, setCategory] = useState<string>(product.category);
  const [productImage, setProductImage] = useState<string>(product.image);

  const handleSave = () => {
    // Validate required fields based on edit mode
    if (isFullEdit) {
      if (!productName.trim()) {
        Alert.alert('Error', 'Product name is required');
        return;
      }
      if (!ean.trim()) {
        Alert.alert('Error', 'EAN is required');
        return;
      }
    }

    if (!internalCode.trim()) {
      Alert.alert('Error', 'Internal Code is required');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum < 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const discountNum = parseInt(discount);
    if (discount && (isNaN(discountNum) || discountNum < 0 || discountNum > 100)) {
      Alert.alert('Error', 'Please enter a valid discount percentage (0-100)');
      return;
    }

    // Create updated product object
    const updatedProduct: Product = {
      ...product,
      internalCode: internalCode.trim(),
      quantity: quantityNum,
      price: priceNum,
      discount: discount ? discountNum : undefined,
      discountDuration: discountDuration.trim() || undefined,
      // Include additional fields for full edit mode
      ...(isFullEdit && {
        name: productName.trim(),
        image: productImage,
        brand: brand.trim() || undefined,
        manufacturerCode: manufacturerCode.trim() || undefined,
        ean: ean.trim(),
        description: description.trim() || undefined,
        category: category.trim(),
      }),
    };

    // Update the product in the context
    updateProduct(updatedProduct);

    // Show success message and go back
    Alert.alert(
      'Success',
      'Product updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProductImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setProductImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleImageChange = () => {
    Alert.alert(
      'Change Product Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'bottom', 'left']}>   
      <Stack.Screen
        options={{
          title: 'Product',
          headerTitleStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#34495E',
          },
        }}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Info Header */}
        <View style={styles.productHeader}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: productImage }} style={styles.productImage} />
            {isFullEdit && (
              <TouchableOpacity style={styles.imageEditOverlay} onPress={handleImageChange}>
                <View style={styles.imageEditBadge}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>
              {isFullEdit ? productName : product.name}
            </Text>
            <Text style={styles.productCategory}>
              {isFullEdit ? category : product.category}
            </Text>
            <Text style={styles.productEan}>
              EAN: {isFullEdit ? ean || 'Not set' : product.ean || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Edit Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>
            {isFullEdit ? 'All Product Fields' : 'Editable Fields'}
          </Text>

          {/* Full Edit Mode Fields */}
          {isFullEdit && (
            <>
              {/* Product Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Product Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={productName}
                  onChangeText={setProductName}
                  placeholder="Enter product name"
                  placeholderTextColor="#BDC3C7"
                />
              </View>

              {/* Brand */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Brand</Text>
                <TextInput
                  style={styles.textInput}
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="Enter brand name"
                  placeholderTextColor="#BDC3C7"
                />
              </View>

              {/* Manufacturer Code */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Manufacturer Code</Text>
                <TextInput
                  style={styles.textInput}
                  value={manufacturerCode}
                  onChangeText={setManufacturerCode}
                  placeholder="Enter manufacturer code"
                  placeholderTextColor="#BDC3C7"
                />
              </View>

              {/* EAN */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EAN *</Text>
                <TextInput
                  style={styles.textInput}
                  value={ean}
                  onChangeText={setEan}
                  placeholder="Enter EAN code"
                  placeholderTextColor="#BDC3C7"
                  keyboardType="numeric"
                />
              </View>

              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput
                  style={styles.textInput}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="Enter category"
                  placeholderTextColor="#BDC3C7"
                />
              </View>

              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, { height: 80 }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter product description"
                  placeholderTextColor="#BDC3C7"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}

          {/* Internal Code */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Internal Code (Retailer) *</Text>
            <TextInput
              style={styles.textInput}
              value={internalCode}
              onChangeText={setInternalCode}
              placeholder="Enter internal code"
              placeholderTextColor="#BDC3C7"
            />
          </View>

          {/* Quantity */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quantity *</Text>
            <TextInput
              style={styles.textInput}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter quantity"
              placeholderTextColor="#BDC3C7"
              keyboardType="numeric"
            />
          </View>

          {/* Price */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price (€) *</Text>
            <TextInput
              style={styles.textInput}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              placeholderTextColor="#BDC3C7"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Discount */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Discount (%)</Text>
            <TextInput
              style={styles.textInput}
              value={discount}
              onChangeText={setDiscount}
              placeholder="Enter discount percentage (optional)"
              placeholderTextColor="#BDC3C7"
              keyboardType="numeric"
            />
          </View>

          {/* Discount Duration */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Discount Duration</Text>
            <TextInput
              style={styles.textInput}
              value={discountDuration}
              onChangeText={setDiscountDuration}
              placeholder="YYYY-MM-DD (optional)"
              placeholderTextColor="#BDC3C7"
            />
          </View>
        </View>

        {/* Read-only Information - Only show in limited edit mode */}
        {!isFullEdit && (
          <View style={styles.readOnlyContainer}>
            <Text style={styles.sectionTitle}>Product Information (Read-only)</Text>

            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyLabel}>Manufacturer Code:</Text>
              <Text style={styles.readOnlyValue}>{product.manufacturerCode || 'N/A'}</Text>
            </View>

            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyLabel}>Brand:</Text>
              <Text style={styles.readOnlyValue}>{product.brand || 'N/A'}</Text>
            </View>

            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyLabel}>Description:</Text>
              <Text style={styles.readOnlyValue} numberOfLines={3}>
                {product.description || 'N/A'}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>    
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
