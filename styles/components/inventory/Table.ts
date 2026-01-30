import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tableWrapper: {
    flex: 1,
  },
  horizontalScrollView: {
    flex: 1,
  },
  tableScrollContainer: {
    flexGrow: 1,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#34495E',
    minWidth: '100%',
  },
  tableHeaderCell: {
    padding: 12,
    justifyContent: 'center',
  },
  actionsHeaderCell: {
    minWidth: 120,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  sortIcon: {
    marginLeft: 4,
  },
  tableBody: {
    flex: 1,
    maxHeight: 300, // Limit height to enable scrolling
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
    minWidth: '100%',
  },
  tableRowEven: {
    backgroundColor: '#F8F9FA',
  },
  tableCell: {
    padding: 8,
    justifyContent: 'center',
  },
  actionsCell: {
    minWidth: 120,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tableActionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  tableCellText: {
    fontSize: 12,
    color: '#34495E',
    textAlign: 'center',
  },
  tablePriceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#27AE60',
    textAlign: 'center',
  },
  tableProductImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignSelf: 'center',
  },
  productNameCell: {
    flex: 1,
    justifyContent: 'center',
  },
  productNameText: {
    fontSize: 12,
    color: '#3498DB',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  emptyTableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});
