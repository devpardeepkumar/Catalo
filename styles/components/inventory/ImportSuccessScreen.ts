import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 40,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#ECF0F1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: '#27AE60',
    fontWeight: 'bold',
  },
  duplicateValue: {
    color: '#F39C12',
  },
  seeArticlesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495E',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  seeArticlesButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
});

