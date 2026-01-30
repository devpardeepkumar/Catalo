import React from 'react';
import { View } from 'react-native';
import { styles } from '../dashboard/styles/ActivityOverview.styles';

interface ProgressBarProps {
  percentage: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const percent = parseFloat(percentage.replace('%', ''));
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percent}%` }]} />
    </View>
  );
};
