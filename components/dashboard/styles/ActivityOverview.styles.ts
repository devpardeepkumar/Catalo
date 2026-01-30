import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    paddingBottom: 8,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  totalEvents: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
  },
  totalEventsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  peakSection: {
    marginBottom: 20,
    backgroundColor: '#F9FBFD',
    borderRadius: 10,
    padding: 15,
    borderWidth:1,
    borderColor: '#E0E6ED',
  },
  peakTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 10,
  },
  peakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeLabel: {
    fontSize: 14,
    color: '#5D6D7E',
    minWidth: 100,
    fontFamily: 'monospace',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E6ED',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3498DB',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    color: '#34495E',
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  chartsContainer: {
    marginTop: 10,
  },
  chartRow: {
    marginBottom: 20,
    backgroundColor: '#F9FBFD',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 15,
  },
  barChartContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
