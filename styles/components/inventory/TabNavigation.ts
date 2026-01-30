import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal:14,
   // justifyContent: 'space-around',
   gap:6,
   // backgroundColor: '#ECF0F1',
   // borderRadius: 10,
   // padding: 5,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  
  },
  activeTab: {
    backgroundColor: '#34495E',
  },
  tabText: {
    fontSize: Platform.OS === 'ios' ? 14 : 12,
    color: '#5D6D7E',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
});
