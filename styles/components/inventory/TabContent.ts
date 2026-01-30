import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 15,
    lineHeight: 20,
  },
  content: {
    marginBottom: 15,
  },
  item: {
    backgroundColor: '#F9FBFD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    fontSize: 14,
    color: '#34495E',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#BDC3C7',
    fontStyle: 'italic',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});
