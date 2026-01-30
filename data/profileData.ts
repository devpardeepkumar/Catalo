export const getDefaultProfileData = () => ({
  basics: {
    storeName: 'My Store',
    storeEmail: '',
    phone: '',
    description: 'Welcome to our store! We offer a wide range of high-quality products and exceptional customer service.',
    logo: 'https://via.placeholder.com/100',
    coverImage: 'https://via.placeholder.com/800x300',
    category: 'General Store',
  },
  location: {
    address: 'Address not set',
    city: 'City not set',
    cap: '',
    state: 'Italy',
    latitude: null,
    longitude: null,
  },
  timeSettings: {
    daysTimes: [
      { day: 'Monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'Tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'Wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'Thursday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'Friday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'Saturday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'Sunday', openTime: null, closeTime: null, isClosed: true },
    ],
    enableVacationMode: false,
  },
  holidays: [],
  updatedAt: new Date().toISOString(),
});
