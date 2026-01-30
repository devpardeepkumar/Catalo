import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
// @ts-ignore - papaparse types may not be available
import Papa from 'papaparse';
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
  onNext: (csvHeaders: string[], sampleRows: any[]) => void;
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
      // Read the CSV file content for local parsing
      const response = await fetch(selectedFileAsset.uri);
      const text = await response.text();

      const formData = new FormData();
      // @ts-ignore
      formData.append('file', { uri: selectedFileAsset.uri, name: selectedFileAsset.name, type: selectedFileAsset.mimeType  ?? 'text/csv'});

      const apiResponse:any = await analyticsApi.uploadCsv(formData);
      console.log('CSV Upload API Response:', apiResponse);
      console.log('First Sample Row:', apiResponse.data.sampleRows);

      Alert.alert('Success', 'CSV file uploaded successfully!');

      // Parse CSV to get headers after successful upload
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          if (results.errors && results.errors.length > 0) {
            Alert.alert('Error', 'Failed to parse CSV file for headers. Please check the file format.');
            onNext([], apiResponse.data.sampleRows || []); // Call onNext even if parsing fails for headers
            return;
          }

          const headers = results.meta?.fields || [];
          
          if (headers.length === 0 && results.data && results.data.length > 0) {
            const firstRow = results.data[0] as Record<string, string>;
            const extractedHeaders = Object.keys(firstRow);
            onNext(extractedHeaders, apiResponse.data.sampleRows || []);
          } else {
            onNext(headers, apiResponse.data.sampleRows || []);
          }
        },
        error: (error: any) => {
          Alert.alert('Error', `Failed to parse CSV for headers: ${error?.message || 'Unknown error'}`);
          onNext([], apiResponse.data.sampleRows || []); // Call onNext even if parsing fails for headers
        },
      });

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
