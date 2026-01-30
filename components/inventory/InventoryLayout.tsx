import React, { useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { styles } from '../../styles/components/inventory/InventoryLayout';
import { ActionButton, ActionButtonsRow } from './ActionButtonsRow';
import { TabNavigation, TabType } from './TabNavigation';

interface InventoryLayoutProps {
  activeTab: TabType;
  actionButtons: ActionButton[];
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
  paginationControls?: React.ReactNode;
}

export const InventoryLayout: React.FC<InventoryLayoutProps> = ({
  activeTab,
  actionButtons,
  onTabChange,
  children,
  paginationControls,
}) => {
    const [contentHeight, setContentHeight] = useState(0);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
  return (
    <>
    <View style={styles.container}>
    {/* <View style={styles.header}>
      <Text style={styles.headerTitle}>Retailer Inventory</Text>
      <View style={{ width: 24 }} /> 
    </View> */}
    
    <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={contentHeight > scrollViewHeight}
        alwaysBounceVertical={false}
        scrollEnabled={contentHeight > scrollViewHeight || Platform.OS !== "ios"}
        onContentSizeChange={(contentWidth, contentHeight) => {
          setContentHeight(contentHeight);
        }}
        onLayout={(event) => {
          setScrollViewHeight(event.nativeEvent.layout.height);
        }}
      >
    {/* <SafeAreaView style={styles.safeArea}> */}

      {/* Fixed Tabs */}
      <View style={styles.tabsWrapper}>
        <TabNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </View>

      {/* Action Buttons */}
      <ActionButtonsRow buttons={actionButtons} />

      {/* Content Area - Passed as children */}
      <View style={styles.contentContainer}>
        {children}
      </View>

      {/* Pagination Controls */}
      {paginationControls}
    {/* </SafeAreaView> */}
    </ScrollView>
    </View>
    </>
  );
};
