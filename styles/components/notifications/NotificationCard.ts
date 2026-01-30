import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34495E',
    marginRight: 12,
    marginTop: 6,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  message: {
    fontSize: Platform.OS === "ios" ? 14 : 12,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  urgentTime: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '600',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#BDC3C7',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#34495E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  secondaryButtonText: {
    color: '#34495E',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
    marginTop: 4,
  },
  checkboxContainer: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E6ED',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#34495E',
    borderColor: '#34495E',
  },
});
