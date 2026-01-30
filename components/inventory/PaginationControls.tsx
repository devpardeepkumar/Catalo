import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/components/inventory/PaginationControls';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            i === currentPage && styles.activePageButton,
          ]}
          onPress={() => onPageChange(i)}
        >
          <Text
            style={[
              styles.pageButtonText,
              i === currentPage && styles.activePageButtonText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
        onPress={handlePrevious}
        disabled={currentPage === 1}
      >
        <Ionicons
          name="chevron-back"
          size={16}
          color={currentPage === 1 ? '#BDC3C7' : '#34495E'}
        />
        {/* <Text
          style={[
            styles.navButtonText,
            currentPage === 1 && styles.disabledButtonText,
          ]}
        >
          Previous
        </Text> */}
      </TouchableOpacity>

      <View style={styles.pageNumbersContainer}>
        {renderPageNumbers()}
      </View>

      <TouchableOpacity
        style={[styles.navButton, currentPage === totalPages && styles.disabledButton]}
        onPress={handleNext}
        disabled={currentPage === totalPages}
      >
        {/* <Text
          style={[
            styles.navButtonText,
            currentPage === totalPages && styles.disabledButtonText,
          ]}
        >
          Next
        </Text> */}
        <Ionicons
          name="chevron-forward"
          size={16}
          color={currentPage === totalPages ? '#BDC3C7' : '#34495E'}
        />
      </TouchableOpacity>
    </View>
  );
};
