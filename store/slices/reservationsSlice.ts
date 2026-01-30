import { reservationsApi } from '@/services/api/reservationsApi';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface Reservation {
  id: string;
  [key: string]: any; // Additional fields from API
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ReservationsState {
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

// Initial state
const initialState: ReservationsState = {
  reservations: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunk
export const fetchReservations = createAsyncThunk(
  'reservations/fetchReservations',
  async ({ page = 1, limit = 20, status }: { page?: number; limit?: number; status?: string }, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.getReservations(page, limit, status);
      return response;
    } catch (error: any) {
      // Simplified error handling
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.request) {
        return rejectWithValue('Network error. Please check your connection.');
      }
      return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
  }
);

// Async thunk for confirming reservations
export const confirmReservation = createAsyncThunk(
  'reservations/confirmReservation',
  async (reservationId: string, { rejectWithValue }) => {
    try {
      const response = await reservationsApi.confirmReservation(reservationId);
      return response;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.request) {
        return rejectWithValue('Network error. Please check your connection.');
      }
      return rejectWithValue(error.message || 'An unexpected error occurred.');
    }
  }
);

// Slice
const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReservations: (state) => {
      state.reservations = [];
      state.pagination = null;
    },
    resetReservationsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;

        // Handle different possible response structures
        let reservationsData = [];
        let paginationData = { page: 1, limit: 20, total: 0, totalPages: 0 };

        if (action.payload) {
          // Handle the new API response structure: { data: { reservations: [...], pagination: {...} }, success: true }
          if (action.payload.data && action.payload.data.reservations && Array.isArray(action.payload.data.reservations)) {
            // Transform the API data to match our expected component structure
            reservationsData = action.payload.data.reservations.map((item: any) => ({
              id: item.id,
              customerId: item.customerId,
              customerCode: `CUST-${item.customerId.slice(-6)}`, // Generate customer code from ID
              customerName: item.customer ? `${item.customer.user.firstName} ${item.customer.user.lastName}` : 'Unknown Customer',
              storeId: item.retailerId,
              status: item.status === 'completed' ? 'collected' :
                      item.status === 'confirmed' ? 'confirmed' :
                      item.status === 'cancelled' ? 'cancelled' :
                      item.status === 'expired' ? 'expired' : 'pending',
              products: [{
                id: item.id, // Use reservation ID as product ID in reservation context
                productId: item.retailerProduct?.productId || '',
                name: item.retailerProduct?.product?.name || 'Unknown Product',
                image: item.retailerProduct?.product?.primaryImageUrl || item.retailerProduct?.product?.imageUrls?.[0] || '',
                price: parseFloat(item.unitPrice || item.retailerProduct?.price || '0'),
                requestedQuantity: item.quantity,
                confirmedQuantity: item.status === 'confirmed' ? item.quantity : 0,
                collectedQuantity: item.status === 'completed' ? item.quantity : 0,
                status: item.status === 'completed' ? 'collected' :
                       item.status === 'confirmed' ? 'confirmed' : 'pending',
                confirmedAt: item.confirmedAt,
                collectedAt: item.completedAt,
              }],
              qrCode: item.qrCodeData || '',
              reservationCode: `RSV-${item.id.slice(-8)}`, // Generate reservation code from ID
              createdAt: item.createdAt,
              expiresAt: item.expiresAt,
              pickupDeadline: item.pickupDeadline,
              confirmedAt: item.confirmedAt,
              collectedAt: item.completedAt,
              totalValue: parseFloat(item.totalPrice || '0'),
            }));
            paginationData = action.payload.data.pagination || paginationData;
          }
          // Fallback to other possible structures
          else if (Array.isArray(action.payload)) {
            // Direct array response - transform if needed
            reservationsData = action.payload.map((item: any) => ({
              id: item.id,
              customerId: item.customerId,
              customerCode: `CUST-${item.customerId.slice(-6)}`,
              customerName: item.customer ? `${item.customer.user.firstName} ${item.customer.user.lastName}` : 'Unknown Customer',
              storeId: item.retailerId,
              status: item.status === 'completed' ? 'collected' :
                      item.status === 'confirmed' ? 'confirmed' :
                      item.status === 'cancelled' ? 'cancelled' :
                      item.status === 'expired' ? 'expired' : 'pending',
              products: [{
                id: item.id,
                productId: item.retailerProduct?.productId || '',
                name: item.retailerProduct?.product?.name || 'Unknown Product',
                image: item.retailerProduct?.product?.primaryImageUrl || item.retailerProduct?.product?.imageUrls?.[0] || '',
                price: parseFloat(item.unitPrice || item.retailerProduct?.price || '0'),
                requestedQuantity: item.quantity,
                confirmedQuantity: item.status === 'confirmed' ? item.quantity : 0,
                collectedQuantity: item.status === 'completed' ? item.quantity : 0,
                status: item.status === 'completed' ? 'collected' :
                       item.status === 'confirmed' ? 'confirmed' : 'pending',
                confirmedAt: item.confirmedAt,
                collectedAt: item.completedAt,
              }],
              qrCode: item.qrCodeData || '',
              reservationCode: `RSV-${item.id.slice(-8)}`,
              createdAt: item.createdAt,
              expiresAt: item.expiresAt,
              pickupDeadline: item.pickupDeadline,
              confirmedAt: item.confirmedAt,
              collectedAt: item.completedAt,
              totalValue: parseFloat(item.totalPrice || '0'),
            }));
          }
          // Keep other fallback structures for backward compatibility
          else if (action.payload.data && Array.isArray(action.payload.data)) {
            reservationsData = action.payload.data;
            paginationData = {
              page: action.payload.page || 1,
              limit: action.payload.limit || 20,
              total: action.payload.total || 0,
              totalPages: action.payload.totalPages || 0,
            };
          } else if (action.payload.reservations && Array.isArray(action.payload.reservations)) {
            reservationsData = action.payload.reservations;
            paginationData = action.payload.pagination || paginationData;
          } else if (action.payload.items && Array.isArray(action.payload.items)) {
            reservationsData = action.payload.items;
            paginationData = action.payload.meta || action.payload.pagination || paginationData;
          }
        }

        // Serialize Date objects to ISO strings for Redux
        const serializedReservations = reservationsData.map((reservation: any) => ({
          ...reservation,
          createdAt: reservation.createdAt instanceof Date ? reservation.createdAt.toISOString() : reservation.createdAt,
          expiresAt: reservation.expiresAt instanceof Date ? reservation.expiresAt.toISOString() : reservation.expiresAt,
          pickupDeadline: reservation.pickupDeadline instanceof Date ? reservation.pickupDeadline.toISOString() : reservation.pickupDeadline,
          confirmedAt: reservation.confirmedAt instanceof Date ? reservation.confirmedAt.toISOString() : reservation.confirmedAt,
          collectedAt: reservation.collectedAt instanceof Date ? reservation.collectedAt.toISOString() : reservation.collectedAt,
          cancelledAt: reservation.cancelledAt instanceof Date ? reservation.cancelledAt.toISOString() : reservation.cancelledAt,
          products: reservation.products?.map((product: any) => ({
            ...product,
            confirmedAt: product.confirmedAt instanceof Date ? product.confirmedAt.toISOString() : product.confirmedAt,
            collectedAt: product.collectedAt instanceof Date ? product.collectedAt.toISOString() : product.collectedAt,
          })) || [],
        }));

        state.reservations = serializedReservations;
        state.pagination = paginationData;
        state.error = null;
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch reservations';
        state.reservations = [];
        state.pagination = null;
      })
      .addCase(confirmReservation.pending, (state) => {
        // Optional: Could set a loading state for the specific reservation
      })
      .addCase(confirmReservation.fulfilled, (state, action) => {
        try {
          // Update the reservation status in the list
          // Get reservationId from the original arguments passed to the thunk
          const reservationId = (action.meta.arg as string);

          if (reservationId && state.reservations) {
            const reservationIndex = state.reservations.findIndex((res: any) => res && res.id === reservationId);
            if (reservationIndex !== -1 && state.reservations[reservationIndex]) {
              // Update the reservation status
              state.reservations[reservationIndex].status = 'confirmed';

              // Update product statuses as well
              const reservation = state.reservations[reservationIndex];
              if (reservation.products && Array.isArray(reservation.products)) {
                reservation.products.forEach((product: any) => {
                  if (product) {
                    product.status = 'confirmed';
                    product.confirmedAt = new Date().toISOString();
                  }
                });
              }
            }
          }
        } catch (error) {
          console.error('Error updating reservation status:', error);
        }
      })
      .addCase(confirmReservation.rejected, (state, action) => {
        // Optional: Could show an error for the specific reservation
        console.error('Failed to confirm reservation:', action.payload);
      });
  },
});

// Export actions & reducer
export const { clearError, clearReservations, resetReservationsState } = reservationsSlice.actions;
export default reservationsSlice.reducer;
