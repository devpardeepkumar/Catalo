import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/components/inventory/ActionButtonsRow';

export interface ActionButton {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface ActionButtonsRowProps {
  buttons: ActionButton[];
}

export const ActionButtonsRow: React.FC<ActionButtonsRowProps> = ({ buttons }) => {
  const shouldShowText = (buttonId: string) => {
    // Hide text for upload-csv and download buttons
    return !['upload-csv', 'download'].includes(buttonId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.button,
              !shouldShowText(button.id) && styles.iconOnlyButton
            ]}
            onPress={button.onPress}
          >
            <Ionicons name={button.iconName} size={20} color="#fff" />
            {shouldShowText(button.id) && (
              <Text style={styles.buttonText}>{button.title}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
