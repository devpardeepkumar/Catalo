import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { CategoryDataPoint, ChartDataPoint } from '../../../services/dashboardData';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 150; // Account for section padding (30) + card padding (20) + chart container padding (20) + margin (80)

interface ChartsSectionProps {
  trendData: ChartDataPoint[];
  categoryData: CategoryDataPoint[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  trendData,
  categoryData,
}) => {
  // Transform data for LineChart
  const lineChartData = trendData.map(item => ({
    value: item.views,
    label: item.date,
    dataPointText: item.views.toString(),
  }));

  const clicksData = trendData.map(item => ({
    value: item.clicks,
    dataPointText: item.clicks.toString(),
  }));

  const bookingsData = trendData.map(item => ({
    value: item.bookings,
    dataPointText: item.bookings.toString(),
  }));

  // Transform data for PieChart
  const pieChartData = categoryData.map((item, index) => ({
    value: item.views,
    text: `${item.percentage}%`,
    color: item.color,
    label: item.name,
    focused: index === 0, // Focus first item by default
  }));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Visual Analytics</Text>

      {/* Activity Trends Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Activity Trends Over Time</Text>
        <Text style={styles.cardSubtitle}>Views, clicks, and bookings</Text>
        <View style={styles.lineChartContainer}>
          <LineChart
            data={lineChartData}
            data2={clicksData}
            data3={bookingsData}
            height={200}
            width={chartWidth}
            spacing={30}
            initialSpacing={15}
            color1="#34495E"
            color2="#2ECC71"
            color3="#E67E22"
            textColor1="#34495E"
            dataPointsColor1="#34495E"
            dataPointsColor2="#2ECC71"
            dataPointsColor3="#E67E22"
            textShiftY={-5}
            textShiftX={-5}
            textFontSize={12}
            thickness={3}
            curved
            showVerticalLines
            verticalLinesColor="#E0E6ED"
            xAxisColor="#7F8C8D"
            yAxisColor="#7F8C8D"
            rulesColor="#E0E6ED"
            rulesType="solid"
            yAxisTextStyle={{ color: '#7F8C8D', fontSize: 12 }}
            xAxisLabelTextStyle={{ color: '#34495E', fontSize: 12 }}
            hideDataPoints={false}
            dataPointsShape="circular"
            dataPointsWidth={6}
            dataPointsHeight={6}
          />
        </View>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#34495E' }]} />
            <Text style={styles.legendText}>Views</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#2ECC71' }]} />
            <Text style={styles.legendText}>Clicks</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#E67E22' }]} />
            <Text style={styles.legendText}>Bookings</Text>
          </View>
        </View>
      </View>

      {/* Category Distribution Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Views by Category</Text>
        <Text style={styles.cardSubtitle}>Distribution of product views</Text>
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieChartData}
            donut
            showText
            textColor="#34495E"
            textSize={12}
            fontWeight="bold"
            strokeWidth={2}
            strokeColor="#fff"
            radius={70}
            showValuesAsLabels={false}
          />
        </View>
        <View style={styles.categoryList}>
          {categoryData.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
              <Text style={styles.categoryText}>
                {category.name}: {category.views} views ({category.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = {
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 10,
    color: '#2C3E50',
  },
  chartCard: {
    backgroundColor: '#F9FBFD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#34495E',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  lineChartContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  pieChartContainer: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  centerLabel: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  centerLabelText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  centerLabelValue: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#34495E',
  },
  legendContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#34495E',
    fontWeight: '500' as const,
  },
  categoryList: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 5,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#34495E',
    flex: 1,
  },
};
