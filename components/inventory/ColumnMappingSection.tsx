import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import apiClient from '../../services/api/apiClient';
import { styles } from '../../styles/components/inventory/ColumnMappingSection';

export interface PlatformField {
  label: string;
  value: string;
  required?: boolean;
}

export interface ColumnMapping {
  csvHeader: string;
  platformField: string | null;
}

interface ColumnMappingSectionProps {
  csvHeaders: string[];
  sampleRows: any[];
  uploadId: string;
  updateOnlyExisting?: boolean;
  onBack: () => void;
  onProcessUpload: (mappings: ColumnMapping[]) => void;
}

const PLATFORM_FIELDS: PlatformField[] = [
  { label: 'EAN', value: 'ean', required: false },
  { label: 'Manufacturer Code', value: 'manufacturerCode', required: false },
  { label: 'Internal Code', value: 'internalCode', required: false },
  { label: 'Product Name', value: 'name', required: true },
  { label: 'Brand', value: 'brand', required: false },
  { label: 'Quantity', value: 'quantity', required: false },
  { label: 'Price', value: 'price', required: false },
  { label: 'Discount', value: 'discount', required: false },
  { label: 'Discount Duration', value: 'discountDuration', required: false },
];

export const ColumnMappingSection: React.FC<ColumnMappingSectionProps> = ({
  csvHeaders,
  uploadId,
  updateOnlyExisting = false,
  onBack,
  onProcessUpload,
  sampleRows,
}) => {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  useEffect(() => {
    // Initialize mappings with all CSV headers
    const initialMappings: ColumnMapping[] = csvHeaders.map((header) => ({
      csvHeader: header,
      platformField: null,
    }));
    setMappings(initialMappings);
  }, [csvHeaders]);

  // No longer calling a preview API here, using sampleRows directly
  useEffect(() => {
    if (sampleRows && sampleRows.length > 0) {
      console.log('Sample Rows for Preview:', sampleRows);
      // You might want to display these sampleRows in the UI for preview
      // For now, just logging to console
    }
  }, [sampleRows]);

  const handleMappingChange = (csvHeader: string, platformField: string | null) => {
    setMappings((prev) =>
      prev.map((mapping) =>
        mapping.csvHeader === csvHeader
          ? { ...mapping, platformField }
          : mapping
      )
    );
  };

  const handleProcessUpload = async () => {
    // Validate that required fields are mapped
    const requiredFields = PLATFORM_FIELDS.filter((f) => f.required);
    const mappedFields = mappings
      .filter((m) => m.platformField)
      .map((m) => m.platformField!);

    const missingRequired = requiredFields.filter(
      (field) => !mappedFields.includes(field.value)
    );

    if (missingRequired.length > 0) {
      Alert.alert(
        'Missing Required Fields',
        `Please map the following required fields: ${missingRequired.map((f) => f.label).join(', ')}`
      );
      return;
    }

    if (!uploadId) {
      Alert.alert('Error', 'Upload ID is missing. Please upload the CSV again.');
      return;
    }

    try {
      // Build body mappings: backend expects Record<platformField, csvHeader>
      const bodyMappings: Record<string, string> = {};
      mappings
        .filter((m) => m.platformField)
        .forEach((m) => {
          // Backend expects manufacturerProductCode; UI uses manufacturerCode
          const key = m.platformField === 'manufacturerCode' ? 'manufacturerProductCode' : m.platformField!;
          bodyMappings[key] = m.csvHeader;
        });

      const response = await apiClient.post(`/retailers/inventory/csv/import/${uploadId}`, {
        mappings: bodyMappings,
        updateOnlyExisting,
      });

      if (response.data?.success) {
        onProcessUpload(mappings);
      } else {
        Alert.alert('Error', response.data?.error?.message || 'Failed to process upload');
      }
    } catch (error: any) {
      console.error('Error calling import API:', error);
      const message = error?.response?.data?.error?.message || 'Failed to process upload';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Column Mapping</Text>
      <Text style={styles.subtitle}>
        Map your CSV columns to platform fields
      </Text>

      {/* Info Note */}
      <View style={styles.infoNote}>
        <Ionicons name="information-circle-outline" size={18} color="#3498DB" />
        <Text style={styles.infoNoteText}>
          Mapping saved for next time
        </Text>
      </View>

      {/* Two Column Layout */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.columnsContainer}>
          {/* Left Column - CSV Headers */}
          <View style={styles.column}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Your CSV Headers</Text>
            </View>
            {csvHeaders.map((header, index) => (
              <View key={index} style={styles.headerRow}>
                <Text style={styles.headerText}>{header}</Text>
              </View>
            ))}
          </View>

          {/* Right Column - Platform Fields */}
          <View style={styles.column}>
            <View style={styles.columnHeader}>
              <Text style={styles.columnHeaderText}>Platform Fields</Text>
            </View>
            {mappings.map((mapping, index) => (
              <View key={index} style={styles.dropdownContainer}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  data={[
                    { label: '-- Select Field --', value: null },
                    ...PLATFORM_FIELDS.map((field) => ({
                      label: field.label + (field.required ? ' *' : ''),
                      value: field.value,
                    })),
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="-- Select Field --"
                  value={mapping.platformField}
                  onChange={(item) => {
                    handleMappingChange(mapping.csvHeader, item.value);
                  }}
                  renderItem={(item) => (
                    <View style={styles.dropdownItem}>
                      <Text
                        style={[
                          styles.dropdownItemText,
                          item.value === null && styles.dropdownItemTextPlaceholder,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  )}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#34495E" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.processButton} 
          onPress={handleProcessUpload}
          activeOpacity={0.8}
        >
          <Text style={styles.processButtonText}>Process Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

