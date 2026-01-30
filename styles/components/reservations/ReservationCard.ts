import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 8,
  },
  customerName: {
    fontSize:Platform.OS === "ios" ? 14 :12,
    color: '#7F8C8D',
    flex: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timer: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timerProgressBar: {
    height: 3,
    backgroundColor: '#E0E6ED',
    borderRadius: 1.5,
    marginLeft: 8,
    width: 40,
  },
  timerProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  productsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productsText: {
    fontSize: Platform.OS === "ios" ? 14 :12,
    color: '#34495E',
  },
  valueText: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontWeight: 'bold',
    color: '#28A745',
  },
  itemsPreview: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: Platform.OS === "ios" ? 13 : 8,
    color: '#34495E',
    flex: 1,
  },
  itemQuantity: {
    fontSize: Platform.OS === "ios" ? 13 : 8,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  moreItems: {
    fontSize: 12,
    color: '#BDC3C7',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  primaryButton: {
    backgroundColor: '#34495E',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: Platform.OS === "ios" ? 14 :12,
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  secondaryButtonText: {
    color: '#34495E',
    fontSize: Platform.OS === "ios" ? 14 :12,
    fontWeight: '600',
    marginLeft: 6,
  },
  statusFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statusText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 6,
    fontWeight: '500',
  },
});
