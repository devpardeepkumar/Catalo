import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TIME_FILTERS, type TimeFilter } from '../../../constants/dashboard';

interface TimeFiltersProps {
  selectedTimeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
}

export const TimeFilters: React.FC<TimeFiltersProps> = ({
  selectedTimeFilter,
  onTimeFilterChange,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSelectFilter = (filter: TimeFilter) => {
    onTimeFilterChange(filter);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <View style={styles.filterSection}>
      <View style={styles.filterRow}>
        <Text style={styles.sectionTitle}>View Data By</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={toggleDropdown}
          >
            <Text style={styles.selectedText}>{selectedTimeFilter}</Text>
            <Ionicons
              name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#34495E"
            />
          </TouchableOpacity>

          {isDropdownVisible && (
            <View style={styles.dropdownList}>
              {TIME_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.dropdownItem,
                    selectedTimeFilter === filter && styles.selectedItem
                  ]}
                  onPress={() => handleSelectFilter(filter)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedTimeFilter === filter && styles.selectedItemText
                  ]}>
                    {filter}
                  </Text>
                  {selectedTimeFilter === filter && (
                    <Ionicons name="checkmark" size={16} color="#34495E" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = {
  filterSection: {
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#2C3E50',
  },
  dropdownContainer: {
    position: 'relative' as const,
    width: 150,
  },
  dropdownButton: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: '#E0E6ED',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#BDC3C7',
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#34495E',
  },
  dropdownList: {
    position: 'absolute' as const,
    top: '100%' as const,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedItem: {
    backgroundColor: '#F8F9FA',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#5D6D7E',
    fontWeight: '400' as const,
  },
  selectedItemText: {
    color: '#34495E',
    fontWeight: '600' as const,
  },
};
