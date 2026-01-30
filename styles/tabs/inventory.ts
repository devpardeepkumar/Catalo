import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
   // marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  tabContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContentText: {
    fontSize: 15,
    color: '#5D6D7E',
    marginBottom: 15,
    textAlign: 'center',
  },
  placeholderItem: {
    backgroundColor: '#F9FBFD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    fontSize: 14,
    color: '#34495E',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  editActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  publishedContainer: {
    flex: 1,
  },
  contentScrollContainer: {
    flex: 1,
  },
  tableBody: {
    maxHeight: height * 0.5, // Limit height to half screen height for scrolling
  },
  productList: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    width: width > 600 ? (width - 48) / 2 : width - 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
    flex: 1,
    marginRight: 8,
  },
  publishedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28A745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  publishedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
    marginBottom: 8,
  },
  performanceContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  performanceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495E',
    marginLeft: 4,
    marginRight: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#7F8C8D',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E6ED',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#007BFF',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  unpublishButton: {
    backgroundColor: '#6C757D',
  },
  unpublishButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailsButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  detailsButtonText: {
    color: '#34495E',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Table styles
  tableWrapper: {
    flex: 1,
    marginHorizontal: 16,
  },
  horizontalScrollView: {
    flex: 1,
  },
  tableScrollContainer: {
    flexGrow: 1,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    width: 1800, // Fixed width wider than screen to enable horizontal scroll (accommodates all columns)
    minWidth: width, // Minimum width is screen width
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#34495E',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: 1800, // Match table container width
  },
  tableHeaderText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
    width: 1800, // Match table container width
  },
  tableRowEven: {
    backgroundColor: '#F8F9FA',
  },
  tableCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellText: {
    fontSize: 12,
    color: '#34495E',
    textAlign: 'center',
  },
  imageCell: {
    width: 100, // Fixed width for image column
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  tableProductImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
  },
  productNameCell: {
    width: 250, // Fixed width instead of flex
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 8,
  },
  productNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34495E',
  },
  eanCell: {
    width: 120, // Fixed width for EAN
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  manufacturerCodeCell: {
    width: 120, // Fixed width for Manufacturer Code
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  brandCell: {
    width: 120, // Fixed width for Brand
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  descriptionCell: {
    width: 200, // Fixed width for Description
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 8,
  },
  internalCodeCell: {
    width: 120, // Fixed width for Internal Code
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  categoryCell: {
    width: 150, // Fixed width
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceCell: {
    width: 100, // Fixed width
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityCell: {
    width: 100, // Fixed width
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountCell: {
    width: 100, // Fixed width for Discount
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  discountDurationCell: {
    width: 140, // Fixed width for Discount Duration
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  tablePriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#28A745',
  },
  statusCell: {
    width: 120, // Fixed width
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsCell: {
    width: 180, // Fixed width
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  tableEditButton: {

   // borderWidth:1,
    //borderColor:'#34495E',
  },
  tableUnpublishButton: {
   // backgroundColor: '#6C757D',
  },
  tableDetailsButton: {
   // backgroundColor: '#F8F9FA',
   // borderWidth: 1,
    //borderColor: '#E0E6ED',
  },
  tableActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  uploadCsvSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inventoryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    flex: 1,
    marginHorizontal: 4,
  },
  inventoryActionButtonText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
});
