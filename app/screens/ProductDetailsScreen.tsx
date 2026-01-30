import { ProductDetailsProps } from '@/types/product';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imageError, setImageError] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  // Parse the product data from params
  const product: ProductDetailsProps = {
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
    description: params.description as string,
    isGeolocated: params.isGeolocated === 'true',
    lastUpdated: params.lastUpdated as string,
  };

  // const handleEditProduct = () => {
  //   Alert.alert('Edit Product', `Edit ${product.name}?`);
  // };

  // const handleUnpublishProduct = () => {
  //   Alert.alert(
  //     'Unpublish Product',
  //     `Are you sure you want to unpublish "${product.name}"? This will remove it from customer search results.`,
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Unpublish',
  //         style: 'destructive',
  //         onPress: () => {
  //           Alert.alert('Success', `${product.name} has been unpublished.`);
  //           router.back();
  //         },
  //       },
  //     ]
  //   );
  // };

  const handleShareProduct = () => {
    Alert.alert('Share Product', `Share ${product.name}?`);
  };

  // const handleDuplicateProduct = () => {
  //   Alert.alert('Duplicate Product', `Create a copy of ${product.name}?`);
  // };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <Stack.Screen
        options={{
          title: product.name,
          headerTitleStyle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: '#34495E',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#34495E" />
            </TouchableOpacity>
          ),
          // headerRight: () => (
          //   <TouchableOpacity onPress={handleShareProduct} style={styles.shareButton}>
          //     <Ionicons name="share-outline" size={24} color="#34495E" />
          //   </TouchableOpacity>
          // ),
        }}
      />

      <ScrollView style={styles.scrollContent}
      contentContainerStyle={styles.scrollview}
       showsVerticalScrollIndicator={false}
       keyboardShouldPersistTaps="handled"
       bounces={contentHeight > scrollViewHeight}
       alwaysBounceVertical={false}
       scrollEnabled={contentHeight > scrollViewHeight || Platform.OS !== "ios"}
       onContentSizeChange={(contentWidth, contentHeight) => {
         setContentHeight(contentHeight);
       }}
       onLayout={(event) => {
         setScrollViewHeight(event.nativeEvent.layout.height);
       }}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageError ? 'https://dummyimage.com/300' : (product.image || 'https://dummyimage.com/300') }}
            style={styles.productImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          {product.isGeolocated && (
            <View style={styles.geolocatedBadge}>
              <Ionicons name="location" size={16} color="#fff" />
              <Text style={styles.geolocatedText}>Local Pickup</Text>
            </View>
          )}
          <View style={styles.publishedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#fff" />
            <Text style={styles.publishedText}>Published</Text>
          </View>
        </View>

        {/* Product Basic Info */}
        <View style={styles.basicInfoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>€{(product.price || 0).toFixed(2)}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.categoryText}>{product.category}</Text>
            {product.brand && (
              <Text style={styles.brandText}> {product.brand}</Text>
            )}
          </View>

          {product.quantity !== undefined && (
            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>Stock:</Text>
              <Text style={[styles.quantityValue, product.quantity <= 5 && styles.lowStock]}>
                {product.quantity} units
              </Text>
              {product.quantity <= 5 && (
                <View style={styles.lowStockBadge}>
                  <Text style={styles.lowStockText}>Low Stock</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Performance Metrics */}
        {(product.views || product.clicks || product.bookings) && (
          <View style={styles.performanceContainer}>
            <Text style={styles.sectionTitle}> Performance</Text>
            <View style={styles.metricsGrid}>
              {product.views && (
                <View style={styles.metricCard}>
                  <Ionicons name="eye-outline" size={24} color="#3498DB" />
                  <Text style={styles.metricValue}>{product.views.toLocaleString()}</Text>
                  <Text style={styles.metricLabel}>Views</Text>
                </View>
              )}
              {product.clicks && (
                <View style={styles.metricCard}>
                  <Ionicons name="finger-print-outline" size={24} color="#E67E22" />
                  <Text style={styles.metricValue}>{product.clicks}</Text>
                  <Text style={styles.metricLabel}>Clicks</Text>
                </View>
              )}
              {product.bookings && (
                <View style={styles.metricCard}>
                  <Ionicons name="bookmark-outline" size={24} color="#28A745" />
                  <Text style={styles.metricValue}>{product.bookings}</Text>
                  <Text style={styles.metricLabel}>Bookings</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Product Details</Text>

          {product.ean && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>EAN Code:</Text>
              <Text style={styles.detailValue}>{product.ean}</Text>
            </View>
          )}

          {product.description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>{product.description}</Text>
            </View>
          )}

          {product.lastUpdated && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last Updated:</Text>
              <Text style={styles.detailValue}>
                {new Date(product.lastUpdated).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {/* <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleEditProduct}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Edit Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleDuplicateProduct}
          >
            <Ionicons name="copy-outline" size={20} color="#34495E" />
            <Text style={styles.secondaryButtonText}>Duplicate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleUnpublishProduct}
          >
            <Ionicons name="eye-off-outline" size={20} color="#fff" />
            <Text style={styles.dangerButtonText}>Unpublish</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
    marginLeft: 16,
  },
  shareButton: {
    marginRight: 16,
  },
  scrollContent: {
    flex: 1,
   },
   scrollview:{ },
  imageContainer: {
    position: 'relative' as const,
    width: width,
    height: 300,
    backgroundColor: '#fff',
  },
  productImage: {
    width: width,
    height: 300,
  },
  geolocatedBadge: {
    position: 'absolute' as const,
    top: 16,
    left: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#28A745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  geolocatedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  publishedBadge: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#28A745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  publishedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  basicInfoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#34495E',
    flex: 1,
    marginRight: 16,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#28A745',
  },
  metaRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  brandText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  quantityRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#34495E',
    marginRight: 8,
  },
  quantityValue: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '600' as const,
    marginRight: 8,
  },
  lowStock: {
    color: '#E74C3C',
  },
  lowStockBadge: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowStockText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold' as const,
  },
  performanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#34495E',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#34495E',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#34495E',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#5D6D7E',
    lineHeight: 24,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 16,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: '#007BFF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  secondaryButtonText: {
    color: '#34495E',
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  dangerButton: {
    backgroundColor: '#DC3545',
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
};
