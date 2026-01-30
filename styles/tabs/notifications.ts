import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
 
  scrollView: {
    flex: 1,
   
  },
  scrollContent: {
    paddingBottom: 90,
  },
  notifyContainer:{
    backgroundColor:'#F4F7FC',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E6ED',
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#34495E',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    //  borderWidth:1,
   // borderColor:'red'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllReadButton: {
    backgroundColor: '#34495E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  markAllReadText: {
    color: '#fff',
    fontSize: Platform.OS === "ios" ? 12 : 8,
    fontWeight: '600',
  },
  deleteAllButton: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  deleteAllText: {
    color: '#fff',
    fontSize: Platform.OS === "ios" ? 12 : 8,
    fontWeight: '600',
    marginLeft: 4,
  },
  settingsButton: {
    padding: 8,
  },
  bulkActionsContainer: {
    marginHorizontal: 16,
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  bulkDeleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E74C3C',
    borderRadius: 8,
  },
  deleteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#E74C3C',
    fontSize: Platform.OS === "ios" ? 14 : 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cancelButton: {
    padding: 4,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    flex: 1,
    textAlign: 'center',
  },
  selectAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#34495E',
    borderRadius: 16,
  },
  selectAllText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteSelectedButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
});
