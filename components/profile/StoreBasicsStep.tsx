import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/components/EditStoreProfileModal';

interface StoreBasicsStepProps {
  // State
  storeName: string;
  storeEmail: string;
  phone: string;
  description: string;
  logoUri: string | null;
  coverImageUri: string | null;
  category: string;
  errors: Record<string, string>;

  // Handlers
  setStoreName: (value: string) => void;
  setStoreEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setDescription: (value: string) => void;
  setCategory: (value: string) => void;
  pickImage: () => void;
  pickCoverImage: () => void;
}

export const StoreBasicsStep: React.FC<StoreBasicsStepProps> = ({
  storeName,
  storeEmail,
  phone,
  description,
  logoUri,
  coverImageUri,
  category,
  errors,
  setStoreName,
  setStoreEmail,
  setPhone,
  setDescription,
  setCategory,
  pickImage,
  pickCoverImage,
}) => {
  return (
    <>
      {/* Store Logo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Logo</Text>
        <TouchableOpacity onPress={pickImage} style={styles.logoContainer}>
          <Image
            source={{ uri: logoUri || 'https://via.placeholder.com/100' }}
            style={styles.logo}
          />
          <View style={styles.logoOverlay}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.logoText}>Change Logo</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Store Cover Image */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cover Image</Text>
        <TouchableOpacity onPress={pickCoverImage} style={styles.coverImageContainer}>
          <Image
            source={{ uri: coverImageUri || 'https://via.placeholder.com/800x300' }}
            style={styles.coverImage}
          />
          <View style={styles.coverImageOverlay}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.coverImageText}>Change Cover Image</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Store Name *</Text>
          <TextInput
            style={[styles.input, errors.storeName && styles.inputError]}
            value={storeName}
            onChangeText={setStoreName}
            placeholder="Enter store name"
            maxLength={100}
          />
          {errors.storeName && <Text style={styles.errorText}>{errors.storeName}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email *</Text>
          <TextInput
            style={[styles.input, errors.storeEmail && styles.inputError]}
            value={storeEmail}
            onChangeText={setStoreEmail}
            placeholder="store@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.storeEmail && <Text style={styles.errorText}>{errors.storeEmail}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone *</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            value={phone}
            onChangeText={setPhone}
            placeholder="+39 123 456 7890"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your store..."
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Store Category *</Text>
          <TextInput
            style={[styles.input, errors.category && styles.inputError]}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g., Grocery, Electronics, Fashion"
            maxLength={50}
          />
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>
      </View>
    </>
  );
};
