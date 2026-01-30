import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical:14,
    gap: 6,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  activeFilterTab: {
    backgroundColor: '#34495E',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  activeTabIcon: {
    color: '#fff',
  },
  tabText: {
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    color: '#5D6D7E',
    fontWeight: '500',
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
