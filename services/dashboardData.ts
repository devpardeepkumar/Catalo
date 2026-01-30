import type { ProductSubFilter, TimeFilter } from '../constants/dashboard';

export interface Product {
  name: string;
  description: string;
  interactions: string;
  price: string;
  image: string;
}

export interface ChartDataPoint {
  date: string;
  views: number;
  bookings: number;
  clicks: number;
}

export interface CategoryDataPoint {
  name: string;
  views: number;
  percentage: number;
  color: string;
}

export interface PeakHourData {
  hour: number;
  label: string;
  count: number;
  percentage: string;
}

export interface PeakDayData {
  day: number;
  label: string;
  count: number;
  percentage: string;
}

export interface PeakHoursData {
  data: PeakHourData[];
  averagePerHour: number;
}

export interface PeakDaysData {
  data: PeakDayData[];
  averagePerDay: number;
}

export interface ActivityPatterns {
  totalEvents: number;
  timeRange: string;
  peakHours: PeakHoursData;
  peakDays: PeakDaysData;
  hourlyDistribution: number[];
  dailyDistribution: number[];
}

export interface DashboardData {
  totalViews: string;
  bookings: string;
  conversion: string;
  productViews: string;
  categoryViews: string;
  activityTrend: string;
  bestTime: string;
  customersFrom: string;
  performance: string;
  alertHighInterest: string;
  alertUnviewed: string;
  alertSuggestion: string;
  topProducts: Product[];
  trendData: ChartDataPoint[];
  categoryData: CategoryDataPoint[];
  activityPatterns: ActivityPatterns;
}

// Product data for different filters and time periods
const PRODUCT_DATA = {
  mostSearched: {
    daily: [
      { name: 'Product XS Daily', description: 'Category A', interactions: '25', price: '10.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product YS Daily', description: 'Category B', interactions: '20', price: '12.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product ZS Daily', description: 'Category C', interactions: '18', price: '15.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product AS Daily', description: 'Category D', interactions: '15', price: '8.75', image: 'https://via.placeholder.com/50' },
      { name: 'Product BS Daily', description: 'Category E', interactions: '10', price: '20.00', image: 'https://via.placeholder.com/50' },
    ],
    weekly: [
      { name: 'Product XS Weekly', description: 'Category A', interactions: '150', price: '10.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product YS Weekly', description: 'Category B', interactions: '120', price: '12.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product ZS Weekly', description: 'Category C', interactions: '100', price: '15.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product AS Weekly', description: 'Category D', interactions: '90', price: '8.75', image: 'https://via.placeholder.com/50' },
      { name: 'Product BS Weekly', description: 'Category E', interactions: '80', price: '20.00', image: 'https://via.placeholder.com/50' },
    ],
    monthly: [
      { name: 'Product XS Monthly', description: 'Category A', interactions: '700', price: '10.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product YS Monthly', description: 'Category B', interactions: '600', price: '12.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product ZS Monthly', description: 'Category C', interactions: '550', price: '15.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product AS Monthly', description: 'Category D', interactions: '500', price: '8.75', image: 'https://via.placeholder.com/50' },
      { name: 'Product BS Monthly', description: 'Category E', interactions: '450', price: '20.00', image: 'https://via.placeholder.com/50' },
    ],
    total: [
      { name: 'Product XS Total', description: 'Category A', interactions: '2.5K', price: '10.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product YS Total', description: 'Category B', interactions: '2K', price: '12.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product ZS Total', description: 'Category C', interactions: '1.8K', price: '15.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product AS Total', description: 'Category D', interactions: '1.5K', price: '8.75', image: 'https://via.placeholder.com/50' },
      { name: 'Product BS Total', description: 'Category E', interactions: '1.2K', price: '20.00', image: 'https://via.placeholder.com/50' },
    ],
  },
  mostClicked: {
    daily: [
      { name: 'Saaphacty Goock', description: 'Clothing', interactions: '15', price: '11.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product CC Daily', description: 'Accessories', interactions: '12', price: '9.99', image: 'https://via.placeholder.com/50' },
      { name: 'Product DC Daily', description: 'Shoes', interactions: '10', price: '45.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product EC Daily', description: 'Bags', interactions: '8', price: '30.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product FC Daily', description: 'Watches', interactions: '7', price: '75.00', image: 'https://via.placeholder.com/50' },
    ],
    weekly: [
      { name: 'Product AW Weekly', description: 'Clothing', interactions: '90', price: '11.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product BW Weekly', description: 'Accessories', interactions: '75', price: '9.99', image: 'https://via.placeholder.com/50' },
      { name: 'Product CW Weekly', description: 'Shoes', interactions: '60', price: '45.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product DW Weekly', description: 'Bags', interactions: '50', price: '30.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product EW Weekly', description: 'Watches', interactions: '40', price: '75.00', image: 'https://via.placeholder.com/50' },
    ],
    monthly: [
      { name: 'Product AM Monthly', description: 'Clothing', interactions: '400', price: '11.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product BM Monthly', description: 'Accessories', interactions: '350', price: '9.99', image: 'https://via.placeholder.com/50' },
      { name: 'Product CM Monthly', description: 'Shoes', interactions: '300', price: '45.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product DM Monthly', description: 'Bags', interactions: '250', price: '30.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product EM Monthly', description: 'Watches', interactions: '200', price: '75.00', image: 'https://via.placeholder.com/50' },
    ],
    total: [
      { name: 'Product AT Total', description: 'Clothing', interactions: '1.5K', price: '11.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product BT Total', description: 'Accessories', interactions: '1.2K', price: '9.99', image: 'https://via.placeholder.com/50' },
      { name: 'Product CT Total', description: 'Shoes', interactions: '1K', price: '45.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product DT Total', description: 'Bags', interactions: '800', price: '30.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product ET Total', description: 'Watches', interactions: '600', price: '75.00', image: 'https://via.placeholder.com/50' },
    ],
  },
  mostBooked: {
    daily: [
      { name: 'Saaphacty Goock', description: 'Electronics', interactions: '8', price: '11.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product FB Daily', description: 'Home Goods', interactions: '6', price: '22.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product GB Daily', description: 'Books', interactions: '5', price: '15.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product HB Daily', description: 'Apparel', interactions: '4', price: '35.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product IB Daily', description: 'Toys', interactions: '3', price: '10.00', image: 'https://via.placeholder.com/50' },
    ],
    weekly: [
      { name: 'Product DW Weekly', description: 'Electronics', interactions: '45', price: '11.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product EW Weekly', description: 'Home Goods', interactions: '30', price: '22.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product FW Weekly', description: 'Books', interactions: '25', price: '15.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product GW Weekly', description: 'Apparel', interactions: '20', price: '35.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product HW Weekly', description: 'Toys', interactions: '15', price: '10.00', image: 'https://via.placeholder.com/50' },
    ],
    monthly: [
      { name: 'Product DM Monthly', description: 'Electronics', interactions: '200', price: '11.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product EM Monthly', description: 'Home Goods', interactions: '150', price: '22.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product FM Monthly', description: 'Books', interactions: '120', price: '15.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product GM Monthly', description: 'Apparel', interactions: '100', price: '35.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product HM Monthly', description: 'Toys', interactions: '80', price: '10.00', image: 'https://via.placeholder.com/50' },
    ],
    total: [
      { name: 'Product DT Total', description: 'Electronics', interactions: '800', price: '11.50', image: 'https://via.placeholder.com/50' },
      { name: 'Product ET Total', description: 'Home Goods', interactions: '600', price: '22.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product FT Total', description: 'Books', interactions: '500', price: '15.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product GT Total', description: 'Apparel', interactions: '400', price: '35.00', image: 'https://via.placeholder.com/50' },
      { name: 'Product HT Total', description: 'Toys', interactions: '300', price: '10.00', image: 'https://via.placeholder.com/50' },
    ],
  },
};

const getTopProductsList = (
  daily: Product[],
  weekly: Product[],
  monthly: Product[],
  total: Product[],
  timeFilter: TimeFilter
): Product[] => {
  switch (timeFilter) {
    case 'Daily': return daily;
    case 'Weekly': return weekly;
    case 'Monthly': return monthly;
    case 'Total': return total;
    default: return total;
  }
};

// Chart data for different time periods
const CHART_DATA = {
  daily: [
    { date: 'Mon', views: 12, bookings: 1, clicks: 8 },
    { date: 'Tue', views: 18, bookings: 2, clicks: 12 },
    { date: 'Wed', views: 15, bookings: 1, clicks: 10 },
    { date: 'Thu', views: 22, bookings: 3, clicks: 15 },
    { date: 'Fri', views: 28, bookings: 2, clicks: 18 },
    { date: 'Sat', views: 32, bookings: 1, clicks: 22 },
    { date: 'Sun', views: 25, bookings: 0, clicks: 16 },
  ],
  weekly: [
    { date: 'Week 1', views: 120, bookings: 8, clicks: 85 },
    { date: 'Week 2', views: 145, bookings: 12, clicks: 98 },
    { date: 'Week 3', views: 135, bookings: 10, clicks: 92 },
    { date: 'Week 4', views: 165, bookings: 15, clicks: 112 },
  ],
  monthly: [
    { date: 'Jan', views: 450, bookings: 25, clicks: 320 },
    { date: 'Feb', views: 520, bookings: 30, clicks: 365 },
    { date: 'Mar', views: 480, bookings: 28, clicks: 340 },
    { date: 'Apr', views: 600, bookings: 35, clicks: 420 },
    { date: 'May', views: 580, bookings: 32, clicks: 410 },
    { date: 'Jun', views: 650, bookings: 40, clicks: 460 },
  ],
  total: [
    { date: '2024', views: 3500, bookings: 200, clicks: 2500 },
  ],
};

const CATEGORY_DATA = {
  daily: [
    { name: 'Electronics', views: 70, percentage: 47, color: '#FF6B6B' },
    { name: 'Clothing', views: 35, percentage: 23, color: '#4ECDC4' },
    { name: 'Home Goods', views: 25, percentage: 17, color: '#45B7D1' },
    { name: 'Books', views: 20, percentage: 13, color: '#96CEB4' },
  ],
  weekly: [
    { name: 'Electronics', views: 400, percentage: 44, color: '#FF6B6B' },
    { name: 'Clothing', views: 250, percentage: 28, color: '#4ECDC4' },
    { name: 'Home Goods', views: 150, percentage: 17, color: '#45B7D1' },
    { name: 'Books', views: 100, percentage: 11, color: '#96CEB4' },
  ],
  monthly: [
    { name: 'Electronics', views: 2000, percentage: 44, color: '#FF6B6B' },
    { name: 'Clothing', views: 1200, percentage: 27, color: '#4ECDC4' },
    { name: 'Home Goods', views: 800, percentage: 18, color: '#45B7D1' },
    { name: 'Books', views: 500, percentage: 11, color: '#96CEB4' },
  ],
  total: [
    { name: 'Electronics', views: 5000, percentage: 50, color: '#FF6B6B' },
    { name: 'Clothing', views: 2500, percentage: 25, color: '#4ECDC4' },
    { name: 'Home Goods', views: 1500, percentage: 15, color: '#45B7D1' },
    { name: 'Books', views: 1000, percentage: 10, color: '#96CEB4' },
  ],
};

const getChartData = (timeFilter: TimeFilter): ChartDataPoint[] => {
  switch (timeFilter) {
    case 'Daily': return CHART_DATA.daily;
    case 'Weekly': return CHART_DATA.weekly;
    case 'Monthly': return CHART_DATA.monthly;
    case 'Total': return CHART_DATA.total;
    default: return CHART_DATA.total;
  }
};

const getCategoryData = (timeFilter: TimeFilter): CategoryDataPoint[] => {
  switch (timeFilter) {
    case 'Daily': return CATEGORY_DATA.daily;
    case 'Weekly': return CATEGORY_DATA.weekly;
    case 'Monthly': return CATEGORY_DATA.monthly;
    case 'Total': return CATEGORY_DATA.total;
    default: return CATEGORY_DATA.total;
  }
};

const getDashboardDataByTime = (timeFilter: TimeFilter): Omit<DashboardData, 'topProducts'> => {
  const activityPatterns: ActivityPatterns = {
    totalEvents: 130,
    timeRange: "30 days",
    peakHours: {
      data: [
        {
          hour: 10,
          label: "10:00-11:00",
          count: 64,
          percentage: "49.2%"
        },
        {
          hour: 11,
          label: "11:00-12:00",
          count: 44,
          percentage: "33.8%"
        },
        {
          hour: 16,
          label: "16:00-17:00",
          count: 13,
          percentage: "10.0%"
        }
      ],
      averagePerHour: 5
    },
    peakDays: {
      data: [
        {
          day: 5,
          label: "Friday",
          count: 126,
          percentage: "96.9%"
        },
        {
          day: 3,
          label: "Wednesday",
          count: 2,
          percentage: "1.5%"
        },
        {
          day: 4,
          label: "Thursday",
          count: 2,
          percentage: "1.5%"
        }
      ],
      averagePerDay: 19
    },
    hourlyDistribution: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 44, 4, 0, 0, 4, 13, 1, 0, 0, 0, 0, 0, 0
    ],
    dailyDistribution: [
      0, 0, 0, 2, 2, 126, 0
    ]
  };

  switch (timeFilter) {
    case 'Daily':
      return {
        totalViews: '150', bookings: '10', conversion: '8.5%',
        productViews: 'Product A (20 views)', categoryViews: 'Electronics (70 views)',
        activityTrend: 'Slight increase today', bestTime: 'Morning, 10 AM - 12 PM',
        customersFrom: '1km radius (90%)', performance: '+5% clicks today',
        alertHighInterest: 'Product M gaining! ', alertUnviewed: 'Product N, Product O', alertSuggestion: 'Product P (popular nearby)',
        trendData: getChartData(timeFilter),
        categoryData: getCategoryData(timeFilter),
        activityPatterns,
      };
    case 'Weekly':
      return {
        totalViews: '900', bookings: '60', conversion: '7.8%',
        productViews: 'Product A (120 views)', categoryViews: 'Electronics (400 views)',
        activityTrend: 'Steady increase this week', bestTime: 'Weekdays, 6 PM - 9 PM',
        customersFrom: '3km radius (80%)', performance: '+10% clicks this week',
        alertHighInterest: 'Product F gaining sudden popularity!', alertUnviewed: 'Product G, Product H', alertSuggestion: 'Product I (popular nearby)',
        trendData: getChartData(timeFilter),
        categoryData: getCategoryData(timeFilter),
        activityPatterns,
      };
    case 'Monthly':
      return {
        totalViews: '4.5K', bookings: '300', conversion: '7.5%',
        productViews: 'Product A (600 views)', categoryViews: 'Electronics (2K views)',
        activityTrend: 'Consistent growth this month', bestTime: 'Evenings, 7 PM - 10 PM',
        customersFrom: '5km radius (75%)', performance: '+15% clicks this month',
        alertHighInterest: 'Product F gaining sudden popularity!', alertUnviewed: 'Product G, Product H', alertSuggestion: 'Product I (popular nearby)',
        trendData: getChartData(timeFilter),
        categoryData: getCategoryData(timeFilter),
        activityPatterns,
      };
    case 'Total':
    default:
      return {
        totalViews: '10K', bookings: '1.2K', conversion: '7.1%',
        productViews: 'Product A (2K views)', categoryViews: 'Electronics (5K views)',
        activityTrend: 'Overall strong performance', bestTime: 'Afternoons, 4 PM - 8 PM',
        customersFrom: '10km radius (60%)', performance: '+20% clicks than average',
        alertHighInterest: 'Product F gaining sudden popularity!', alertUnviewed: 'Product G, Product H (0 views)', alertSuggestion: 'Product I (popular nearby)',
        trendData: getChartData(timeFilter),
        categoryData: getCategoryData(timeFilter),
        activityPatterns,
      };
  }
};

export const getSimulatedDashboardData = (
  timeFilter: TimeFilter,
  productSubFilter: ProductSubFilter
): DashboardData => {
  const baseData = getDashboardDataByTime(timeFilter);

  let topProducts: Product[] = [];
  switch (productSubFilter) {
    case 'Most Searched':
      topProducts = getTopProductsList(
        PRODUCT_DATA.mostSearched.daily,
        PRODUCT_DATA.mostSearched.weekly,
        PRODUCT_DATA.mostSearched.monthly,
        PRODUCT_DATA.mostSearched.total,
        timeFilter
      );
      break;
    case 'Most Clicked':
      topProducts = getTopProductsList(
        PRODUCT_DATA.mostClicked.daily,
        PRODUCT_DATA.mostClicked.weekly,
        PRODUCT_DATA.mostClicked.monthly,
        PRODUCT_DATA.mostClicked.total,
        timeFilter
      );
      break;
    case 'Most Booked':
    default:
      topProducts = getTopProductsList(
        PRODUCT_DATA.mostBooked.daily,
        PRODUCT_DATA.mostBooked.weekly,
        PRODUCT_DATA.mostBooked.monthly,
        PRODUCT_DATA.mostBooked.total,
        timeFilter
      );
      break;
  }

  return {
    ...baseData,
    topProducts,
  };
};
