import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/components/inventory/ImportSuccessScreen';

interface ImportSuccessScreenProps {
  matchedItemsCount: number;
  totalProcessed?: number;
  duplicatesSkipped?: number;
  onSeeArticles: () => void;
}

export const ImportSuccessScreen: React.FC<ImportSuccessScreenProps> = ({
  matchedItemsCount,
  totalProcessed = matchedItemsCount,
  duplicatesSkipped = 0,
  onSeeArticles,
}) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Import</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.progressText}>100%</Text>
      </View>

      {/* Success Message */}
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={64} color="#27AE60" />
        <Text style={styles.successTitle}>Import completed successfully!</Text>

        {/* Import Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total processed:</Text>
            <Text style={styles.statValue}>{totalProcessed}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>New products imported:</Text>
            <Text style={styles.statValue}>{matchedItemsCount}</Text>
          </View>

          {duplicatesSkipped > 0 && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Duplicates for review:</Text>
              <Text style={[styles.statValue, styles.duplicateValue]}>{duplicatesSkipped}</Text>
            </View>
          )}
        </View>

        <Text style={styles.successSubtitle}>
          {duplicatesSkipped > 0
            ? `${matchedItemsCount} new products added${duplicatesSkipped > 0 ? `, ${duplicatesSkipped} duplicates added to "No Product Info" section` : ''}`
            : `${matchedItemsCount} products have been imported`
          }
        </Text>
      </View>

      {/* See Articles Button */}
      <TouchableOpacity style={styles.seeArticlesButton} onPress={onSeeArticles}>
        <Text style={styles.seeArticlesButtonText}>SEE ARTICLES</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

