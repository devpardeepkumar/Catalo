import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E6ED',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: '800',
   borderWidth: 1,
   borderColor: '#34495E',
   // minWidth: 80,
    justifyContent: 'center',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34495E',
    marginHorizontal: 4,
  },
  disabledButton: {
   // backgroundColor: 'red',
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#BDC3C7',
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pageButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: '#F8F9FA',
    
  },
  activePageButton: {
    backgroundColor: '#34495E',
    borderRadius: 20,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#34495E',
  },
  activePageButtonText: {
    color: '#fff',
    
  },
});
