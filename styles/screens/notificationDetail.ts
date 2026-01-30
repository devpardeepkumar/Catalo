import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  detailsContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E6ED',
    width: '100%',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    textAlign: 'center',
  },
  urgentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  urgentText: {
    fontSize: 14,
    color: '#E74C3C',
    marginLeft: 8,
    flex: 1,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  alertText: {
    fontSize: 14,
    color: '#F57C00',
    marginLeft: 8,
    flex: 1,
  },
  actionsContainer: {
    marginTop: 24,
  },
  primaryAction: {
    backgroundColor: '#34495E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryAction: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  secondaryActionText: {
    color: '#34495E',
    fontSize: 16,
    fontWeight: '600',
  },
});
