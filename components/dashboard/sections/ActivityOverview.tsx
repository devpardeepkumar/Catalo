import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ActivityPatterns } from '../../../services/dashboardData';
import { ProgressBar } from '../../common/ProgressBar';
import { styles } from '../styles/ActivityOverview.styles';

const screenWidth = Dimensions.get('window').width;
const containerWidth = screenWidth - 60; // Account for section padding (15) + margin (45)

const hourlyBarWidth = 25;
const hourlySpacing = 2;
const hourlyChartWidth = 8 * (hourlyBarWidth + hourlySpacing); 

const dailyBarWidth = 25;
const dailySpacing = 20;
const dailyChartWidth = 7 * (dailyBarWidth + dailySpacing); 

interface ActivityOverviewProps {
  activityPatterns: ActivityPatterns;
}

export const ActivityOverview: React.FC<ActivityOverviewProps> = ({ activityPatterns }) => {
 // console.log(activityPatterns, '<---------- check activity Patterns -----> ')

  // Transform hourly distribution data for BarChart
  const hourlyChartData = activityPatterns.hourlyDistribution.map((value, index) => ({
    value,
    label: `${index}:00`,
    frontColor: value > 0 ? '#3498DB' : '#E0E6ED',
    topLabelComponent: () => value > 0 ? (
      <Text style={{ color: '#34495E', fontSize: 10, fontWeight: '600' }}>{value}</Text>
    ) : null,
  }));

  // Transform daily distribution data for BarChart
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyChartData = activityPatterns.dailyDistribution.map((value, index) => ({
    value,
    label: dayLabels[index],
    frontColor: value > 0 ? '#2ECC71' : '#E0E6ED',
    topLabelComponent: () => value > 0 ? (
      <Text style={{ color: '#34495E', fontSize: 10, fontWeight: '600' }}>{value}</Text>
    ) : null,
  }));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Best Time for Activity </Text>
      <View style={styles.headerContainer}>
        <Text style={styles.totalEvents}>Total Events : {activityPatterns.timeRange} </Text>
        <Text style={styles.totalEventsValue}>{activityPatterns.totalEvents}</Text>
      </View>
      <View style={styles.peakSection}>
        <Text style={styles.peakTitle}>Peak Hours</Text>
        {activityPatterns.peakHours.data.map((hourData, index) => (
          <View key={index} style={styles.peakRow}>
            <Text style={styles.timeLabel}>{hourData.label}</Text>
            <View style={styles.progressContainer}>
              <ProgressBar percentage={hourData.percentage} />
            </View>
            <Text style={styles.percentage}>{hourData.percentage}</Text>
          </View>
        ))}
      </View>

      {/* Peak Days */}
      <View style={styles.peakSection}>
        <Text style={styles.peakTitle}>Peak Days</Text>
        {activityPatterns.peakDays.data.map((dayData, index) => (
          <View key={index} style={styles.peakRow}>
            <Text style={styles.timeLabel}>{dayData.label}</Text>
            <View style={styles.progressContainer}>
              <ProgressBar percentage={dayData.percentage} />
            </View>
            <Text style={styles.percentage}>{dayData.percentage}</Text>
          </View>
        ))}
      </View>

      {/* Charts */}
      <View style={styles.chartsContainer}>
        <View style={styles.chartRow}>
          <Text style={styles.chartTitle}>Hourly Activity Distribution</Text>
          <View style={styles.barChartContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              <BarChart
                data={hourlyChartData}
                width={Math.max(hourlyChartWidth, containerWidth)}
                height={150}
                barWidth={hourlyBarWidth}
                spacing={hourlySpacing}
                barBorderRadius={2}
                frontColor="#3498DB"
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor="#E0E6ED"
                yAxisTextStyle={{ color: '#7F8C8D', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: '#34495E', fontSize: 10 }}
                showLine={false}
                lineConfig={{ color: '#E0E6ED' }}
                isAnimated
              />
            </ScrollView>
          </View>
        </View>

        <View style={styles.chartRow}>
          <Text style={styles.chartTitle}>Daily Activity Distribution</Text>
          <View style={styles.barChartContainer}>
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            >
            <BarChart
              data={dailyChartData}
              width={Math.max(dailyChartWidth, containerWidth)}
              height={150}
              barWidth={dailyBarWidth}
              spacing={dailySpacing}
              barBorderRadius={3}
              frontColor="#2ECC71"
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#E0E6ED"
              yAxisTextStyle={{ color: '#7F8C8D', fontSize: 10 }}
              xAxisLabelTextStyle={{ color: '#34495E', fontSize: 12 }}
              showLine={false}
              lineConfig={{ color: '#E0E6ED' }}
              isAnimated
            />
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};
