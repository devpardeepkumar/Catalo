import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    overflow: 'hidden',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
  },
  activeFilterTab: {
    backgroundColor: '#0a7ea4',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  activeTabIcon: {
    color: '#fff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  activeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34495E',
  },
  activeBadgeText: {
    color: '#fff',
  },
});
