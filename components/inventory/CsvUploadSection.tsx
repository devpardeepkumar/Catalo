import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { analyticsApi } from '../../services/api/analyticsApi';
import { styles } from '../../styles/components/inventory/CsvUploadSection';

interface CsvUploadSectionProps {
  selectedFile: string | null;
  selectedFileAsset: DocumentPicker.DocumentPickerAsset | null;
  updateOnlyExisting: boolean;
  onFileSelect: (fileName: string | null, asset: DocumentPicker.DocumentPickerAsset | null) => void;
  onUpdateOnlyChange: (value: boolean) => void;
  onCancel: () => void;
  onNext: (csvHeaders: string[], sampleRows: any[], uploadId: string) => void;
}

export const CsvUploadSection: React.FC<CsvUploadSectionProps> = ({
  selectedFile,
  selectedFileAsset,
  updateOnlyExisting,
  onFileSelect,
  onUpdateOnlyChange,
  onCancel,
  onNext,
}) => {
  const [isParsing, setIsParsing] = useState(false);

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onFileSelect(asset.name || 'Selected file', asset);
        console.log('Selected file:', asset);
      } else {
        console.log('File selection cancelled');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleNext = async () => {
    if (!selectedFile || !selectedFileAsset) {
      Alert.alert('Error', 'Please select a CSV file first.');
      return;
    }

    setIsParsing(true);
    try {
      const formData = new FormData();
      // @ts-ignore - React Native file object for FormData
      formData.append('file', { uri: selectedFileAsset.uri, name: selectedFileAsset.name, type: selectedFileAsset.mimeType ?? 'text/csv' });

      const apiResponse: any = await analyticsApi.uploadCsv(formData);

      if (!apiResponse?.success || !apiResponse?.data) {
        Alert.alert('Error', apiResponse?.error?.message || 'Upload failed. Please try again.');
        return;
      }

      const { headers = [], sampleRows = [], uploadId } = apiResponse.data;

      // Optional: log full response (console abbreviates nested objects; this shows full sampleRows)
      if (__DEV__) {
        console.log('CSV Upload API Response:', JSON.stringify(apiResponse, null, 2));
      }

      Alert.alert('Success', 'CSV file uploaded successfully!');

      onNext(headers, sampleRows, uploadId || '');
    } catch (error) {
      console.error('Error processing CSV:', error);
      Alert.alert('Error', 'Failed to process CSV file. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const toggleUpdateOnly = () => {
    onUpdateOnlyChange(!updateOnlyExisting);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Upload CSV</Text>

      {/* File Picker Area */}
      <TouchableOpacity style={styles.filePickerArea} onPress={handleChooseFile}>
        <View style={styles.filePickerContent}>
          <Ionicons
            name={selectedFile ? "document" : "cloud-upload-outline"}
            size={48}
            color="#7F8C8D"
          />
          <Text style={styles.filePickerTitle}>
            {selectedFile ? 'File Selected' : 'Choose File'}
          </Text>
          <Text style={styles.filePickerSubtitle}>
            {selectedFile
              ? selectedFile
              : 'Click to browse or drag and drop your CSV file here'
            }
          </Text>
        </View>
      </TouchableOpacity>

      {/* Selected File Info */}
      {selectedFile && (
        <View style={styles.selectedFileInfo}>
          <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
          <Text style={styles.selectedFileText}>{selectedFile}</Text>
        </View>
      )}

      {/* Toggle Option */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.checkbox, updateOnlyExisting && styles.checkboxChecked]}
          onPress={toggleUpdateOnly}
        >
          {updateOnlyExisting && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </TouchableOpacity>
        <Text style={styles.toggleText}>Update only existing products</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, (!selectedFile || isParsing) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selectedFile || isParsing}
        >
          <Text style={[styles.nextButtonText, (!selectedFile || isParsing) && styles.nextButtonTextDisabled]}>
            {isParsing ? 'Parsing...' : 'Next'}
          </Text>
          {!isParsing && (
            <Ionicons name="arrow-forward" size={20} color={selectedFile ? "#fff" : "#BDC3C7"} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
