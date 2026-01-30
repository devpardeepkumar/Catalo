import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/components/inventory/TabContent';

interface TabContentProps {
  title: string;
  description?: string;
  items?: string[];
  actionButton?: {
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
  emptyMessage?: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  title,
  description,
  items = [],
  actionButton,
  emptyMessage = 'No items available',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}

      <View style={styles.content}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <Text key={index} style={styles.item}>
              {item}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        )}
      </View>

      {actionButton && (
        <TouchableOpacity style={styles.actionButton} onPress={actionButton.onPress}>
          <Ionicons name={actionButton.iconName} size={20} color="#fff" />
          <Text style={styles.actionButtonText}>{actionButton.title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
