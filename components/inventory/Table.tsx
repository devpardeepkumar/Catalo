import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/components/inventory/Table';

export interface TableColumn {
  key: string;
  title: string;
  width?: number;
  render?: (item: any, index: number, styles?: any) => React.ReactNode;
  sortable?: boolean;
  // Allow custom data type for better type safety
  type?: 'image' | 'price' | 'discount' | 'quantity' | 'description' | 'text' | 'custom';
}

export interface TableAction {
  key: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: (item: any) => void;
  style?: any;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  onRowPress?: (item: any) => void;
  keyExtractor?: (item: any) => string;
  emptyMessage?: string;
}

// Generic image component for fallback handling
const ImageWithFallback: React.FC<{ uri: string; style: any; fallbackUri?: string }> = ({
  uri,
  style,
  fallbackUri = 'https://dummyimage.com/300'
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Image
      source={{ uri: imageError ? fallbackUri : uri }}
      style={style}
      resizeMode="cover"
      onError={() => setImageError(true)}
    />
  );
};

// Default renderers for common column types
const defaultRenderers = {
  image: (value: any, styles: any) => (
    <ImageWithFallback
      uri={value || 'https://dummyimage.com/300'}
      style={styles.tableProductImage}
    />
  ),

  price: (value: any, styles: any) => {
    if (typeof value === 'number') {
      return <Text style={styles.tablePriceText}>€{value.toFixed(2)}</Text>;
    }
    return <Text style={styles.tableCellText}>{value || '-'}</Text>;
  },

  discount: (value: any, styles: any) => (
    <Text style={styles.tableCellText}>{value ? `${value}%` : '-'}</Text>
  ),

  quantity: (value: any, styles: any) => (
    <Text style={styles.tableCellText}>{typeof value === 'number' ? value : (value || '-')}</Text>
  ),

  description: (value: any, styles: any) => (
    <Text style={styles.tableCellText} numberOfLines={2} ellipsizeMode="tail">
      {value && value.trim() ? value : '-'}
    </Text>
  ),

  default: (value: any, styles: any) => (
    <Text style={styles.tableCellText}>{value || '-'}</Text>
  )
};

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  actions = [],
  onRowPress,
  keyExtractor = (item) => item.id,
  emptyMessage = 'No data available',
}) => {
  const renderCell = (column: TableColumn, item: any, index: number) => {
    // Allow custom render function to override default behavior
    if (column.render) {
      return column.render(item, index, styles);
    }

    const value = item[column.key];

    // Use type field if specified, otherwise try to match by key
    const rendererKey = column.type || column.key;
    const renderer = defaultRenderers[rendererKey as keyof typeof defaultRenderers] || defaultRenderers.default;
    return renderer(value, styles);
  };

  const renderTableRow = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowEven]}>
      {columns.map((column) => (
        <View key={column.key} style={[styles.tableCell, { width: column.width || 120 }]}>
          {column.key === 'name' && onRowPress ? (
            <TouchableOpacity
              style={styles.productNameCell}
              onPress={() => onRowPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.productNameText} numberOfLines={2}>
                {renderCell(column, item, index)}
              </Text>
            </TouchableOpacity>
          ) : (
            renderCell(column, item, index)
          )}
        </View>
      ))}

      {actions.length > 0 && (
        <View style={[styles.tableCell, styles.actionsCell]}>
          <View style={styles.actionsRow}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={[styles.tableActionButton, action.style]}
                onPress={() => action.onPress(item)}
              >
                <Ionicons name={action.iconName} size={14} color="#34495E" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{emptyMessage}</Text>
    </View>
  );

  if (data.length === 0) {
    return (
      <View style={styles.tableWrapper}>
        <View style={styles.emptyTableContainer}>
          {renderEmptyState()}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tableWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.horizontalScrollView}
        contentContainerStyle={styles.tableScrollContainer}
      >
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            {columns.map((column) => (
              <View key={column.key} style={[styles.tableHeaderCell, { width: column.width || 120 }]}>
                <Text style={styles.tableHeaderText}>{column.title}</Text>
                {column.sortable && (
                  <Ionicons name="chevron-expand" size={12} color="#7F8C8D" style={styles.sortIcon} />
                )}
              </View>
            ))}
            {actions.length > 0 && (
              <View style={[styles.tableHeaderCell, styles.actionsHeaderCell]}>
                <Text style={styles.tableHeaderText}>Actions</Text>
              </View>
            )}
          </View>

          {/* Table Body */}
          <ScrollView
            style={styles.tableBody}
            showsVerticalScrollIndicator={true}
          >
            {data.map((item, index) => (
              <View key={keyExtractor(item)}>
                {renderTableRow({ item, index })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};
