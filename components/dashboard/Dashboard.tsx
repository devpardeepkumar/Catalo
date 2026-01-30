import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { PRODUCT_SUB_FILTERS, type ProductSubFilter } from '../../constants/dashboard';
import { type DashboardData } from '../../services/dashboardData';
import { ActivityOverview, AlertsSection, ChartsSection, RetailerStats } from './sections';
import { styles } from './styles';

interface DashboardSectionsProps {
  dashboardData: DashboardData;
  metricsData?: any;
  selectedProductSubFilter: ProductSubFilter;
  onProductSubFilterChange: (filter: ProductSubFilter) => void;
}

export const DashboardSections: React.FC<DashboardSectionsProps> = ({
  dashboardData,
  metricsData,
  selectedProductSubFilter,
  onProductSubFilterChange,
}) => {
 //console.log('DashboardSections received dashboardData:', dashboardData);
  // console.log('Selected product sub-filter:', selectedProductSubFilter);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const barChartWidth = screenWidth - 90; // section padding + card padding

  const clickThroughRate = Number(metricsData?.conversionRates?.clickThroughRate ?? 0);
  const conversionRate = Number(metricsData?.conversionRates?.conversionRate ?? 0);

  const conversionBars = [
    { value: clickThroughRate, label: 'CTR', frontColor: '#2ECC71' },
    { value: conversionRate, label: 'Conversion', frontColor: '#E67E22' },
  ];

  const handleSelectFilter = (filter: ProductSubFilter) => {
    onProductSubFilterChange(filter);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  return (
    <>
     <RetailerStats />
      {/* Visual Analytics */}
      <ChartsSection
        trendData={dashboardData.trendData}
        categoryData={dashboardData.categoryData}
      />
     

      {/* Product Visibility & Engagement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Visibility & Engagement</Text>
     
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Product Views</Text>
              <Text style={styles.cardValue}>{dashboardData.totalViews} <Text style={styles.growthText}>+15%</Text></Text>
              <Text style={styles.cardSubtitle}>from last week</Text>
            </View>
         
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Views by Product</Text>
          <Text style={styles.cardValue}>Top: {dashboardData.productViews}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Views by Category</Text>
          <Text style={styles.cardValue}>Top: {dashboardData.categoryViews}</Text>
        </View>
      </View>

      {/* Bookings & Customer Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bookings & Customer Actions</Text>
       
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Bookings</Text>
              <Text style={styles.cardValue}>{dashboardData.bookings} <Text style={styles.growthText}>+8%</Text></Text>
              <Text style={styles.cardSubtitle}>from last week</Text>
            </View>
         
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Requests</Text>
          <Text style={styles.cardValue}>{dashboardData.bookings}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Product Page Opens</Text>
          <Text style={styles.cardValue}>950</Text>
        </View>
       
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Conversion Rate</Text>
              <Text style={styles.cardValue}>{dashboardData.conversion}</Text>
              <Text style={styles.cardSubtitle}>(Views to Actions)</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Conversion Performance</Text>
              <Text style={styles.cardSubtitle}>CTR vs Conversion Rate</Text>
              <BarChart
                data={conversionBars}
                width={barChartWidth}
                height={160}
                barWidth={42}
                spacing={34}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{ color: '#7F8C8D', fontSize: 12 }}
                xAxisLabelTextStyle={{ color: '#34495E', fontSize: 12 }}
                showValuesAsTopLabel
                topLabelTextStyle={{ color: '#34495E', fontSize: 12 }}
              />
              <Text style={[styles.cardSubtitle, { marginTop: 10 }]}>
                Click throug Rate: {clickThroughRate.toFixed(2)}%  •  Conversion: {conversionRate.toFixed(2)}%
              </Text>
            </View>
        
      </View>

      {/* Top Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Products</Text>
          <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={toggleDropdown}
          >
            <Text style={styles.selectedText}>{selectedProductSubFilter}</Text>
            <Ionicons
              name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#34495E"
            />
          </TouchableOpacity>

          {isDropdownVisible && (
            <View style={styles.dropdownList}>
              {PRODUCT_SUB_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.dropdownItem,
                    selectedProductSubFilter === filter && styles.selectedItem
                  ]}
                  onPress={() => handleSelectFilter(filter)}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedProductSubFilter === filter && styles.selectedItemText
                  ]}>
                    {filter}
                  </Text>
                  {selectedProductSubFilter === filter && (
                    <Ionicons name="checkmark" size={16} color="#34495E" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          </View>
        </View>
        {(() => {
          return (
            <><Text style={styles.cardTitle}>{selectedProductSubFilter}</Text>
            <View style={styles.card}>
              
              {dashboardData.topProducts.map((product, index) => (
                <TouchableOpacity key={index} style={styles.productCard}>
                  {/* <Ionicons name="image-outline" size={60} color="#E0E6ED" style={styles.productImage} /> */}
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDescription}>{product.description}</Text>
                    <Text>{product.price}</Text>
                    
                  </View>
                  <View style={styles.productPriceContainer}>
                  <View style={styles.productStats}>
                      <Ionicons name="eye-outline" size={14} color="rgb(46, 95, 255)" />
                    </View>
                    <Text style={styles.productInteraction}>{product.interactions}</Text>
                  
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            </>
          );
        })()}
      </View>

      {/* Operational Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operational Insights</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Activity Trend</Text>
          <Text style={styles.cardValue}>{dashboardData.activityTrend}</Text>
        </View>
       
      </View>

      <ActivityOverview
        activityPatterns={dashboardData.activityPatterns}
      />
     

      {/* Geographical Interest */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geographical Interest</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customers From</Text>
          <Text style={styles.cardValue}>{dashboardData.customersFrom}</Text>
        </View>
      </View>

      {/* Performance Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Comparison</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>vs. Nearby Stores</Text>
          <Text style={styles.cardValue}>{dashboardData.performance}</Text>
        </View>
      </View>

      {/* Alerts & Suggestions */}
      <AlertsSection />
    </>
  );
};
