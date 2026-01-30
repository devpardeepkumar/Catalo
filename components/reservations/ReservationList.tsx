import React, { ReactNode, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch } from '../../store/hooks';
import { confirmReservation } from '../../store/slices/reservationsSlice';
import { styles } from '../../styles/components/reservations/ReservationList';
import { Reservation } from '../../types/reservation';

interface ReservationListProps {
  reservations?: Reservation[];
  filter?: 'requests' | 'history';
  statusFilter?: 'all' | 'active' | 'completed' | 'pending' | 'canceled' | 'history';
  headerComponent?: ReactNode;
}

export const ReservationList: React.FC<ReservationListProps> = ({
  reservations: propReservations,
  filter,
  statusFilter = 'all',
  headerComponent
}) => {
  const dispatch = useAppDispatch();
  const [confirmingReservations, setConfirmingReservations] = useState<Set<string>>(new Set());
  const [confirmedReservations, setConfirmedReservations] = useState<Set<string>>(new Set());
  // Use prop reservations if available, otherwise fallback to mock data
  const mockReservations: Reservation[] = [
    {
      id: '1',
      customerId: 'cust-123',
      customerCode: 'CUST-789',
      customerName: 'John Doe',
      storeId: 'store-1',
      status: 'pending',
      products: [
        {
          id: '1',
          productId: 'prod-1',
          name: 'iPhone 15 Pro',
          image: 'https://dummyimage.com/100',
          price: 999,
          requestedQuantity: 1,
          confirmedQuantity: 0,
          collectedQuantity: 0,
          status: 'pending',
        },
        {
          id: '2',
          productId: 'prod-2',
          name: 'Phone Case',
          image: 'https://dummyimage.com/100',
          price: 29,
          requestedQuantity: 1,
          confirmedQuantity: 0,
          collectedQuantity: 0,
          status: 'pending',
        },
      ],
      qrCode: 'QR123456',
      reservationCode: 'RSV-001234',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago (Green phase)
      expiresAt: new Date(Date.now() + 25 * 60 * 1000), // 25 minutes from now
      pickupDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      totalValue: 1028,
    }
    
  ];

  // Ensure we always have an array to work with
  const reservationsToFilter = Array.isArray(propReservations) && propReservations.length > 0 ? propReservations : mockReservations;
  const reservationsWithDates = reservationsToFilter.map(reservation => ({
    ...reservation,
    createdAt: typeof reservation.createdAt === 'string' ? new Date(reservation.createdAt) : reservation.createdAt,
    expiresAt: typeof reservation.expiresAt === 'string' ? new Date(reservation.expiresAt) : reservation.expiresAt,
    pickupDeadline: typeof reservation.pickupDeadline === 'string' ? new Date(reservation.pickupDeadline) : reservation.pickupDeadline,
    confirmedAt: typeof reservation.confirmedAt === 'string' ? new Date(reservation.confirmedAt) : reservation.confirmedAt,
    collectedAt: typeof reservation.collectedAt === 'string' ? new Date(reservation.collectedAt) : reservation.collectedAt,
    cancelledAt: typeof reservation.cancelledAt === 'string' ? new Date(reservation.cancelledAt) : reservation.cancelledAt,
    products: reservation.products?.map(product => ({
      ...product,
      confirmedAt: typeof product.confirmedAt === 'string' ? new Date(product.confirmedAt) : product.confirmedAt,
      collectedAt: typeof product.collectedAt === 'string' ? new Date(product.collectedAt) : product.collectedAt,
    })) || [],
  }));

  const filteredReservations = reservationsWithDates.filter(reservation => {
    if (statusFilter === 'all') return true;

    if (statusFilter === 'active') {
      // Show reservations that are open OR have confirmed products
      const hasConfirmedProducts = reservation.products.some(product => product.status === 'confirmed');
      return reservation.status === 'open' || hasConfirmedProducts;
    }

    if (statusFilter === 'completed') {
      return reservation.status === 'collected';
    }

    if (statusFilter === 'pending') {
      // Show all pending/active reservations with timer colors:
      // Green: First 30 minutes, Yellow: 30-45 minutes, Red: After 45 minutes
      return reservation.status === 'pending' || reservation.status === 'open';
    }

    if (statusFilter === 'canceled') {
      return reservation.status === 'cancelled';
    }

    if (statusFilter === 'history') {
      return ['collected', 'cancelled', 'expired'].includes(reservation.status);
    }
    return true;
  });

  return (
    <FlatList
      data={filteredReservations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          margin: 12,
          padding: 16,
          borderLeftWidth: 4,
          borderLeftColor: item.status === 'collected' ? '#28A745' :
                           item.status === 'confirmed' ? '#FFC107' : '#007AFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2C3E50' }}>
                {item.reservationCode}
              </Text>
              <Text style={{ fontSize: 14, color: '#7F8C8D', marginTop: 2 }}>
                {item.customerName}
              </Text>
            </View>
            <View style={{
              backgroundColor: item.status === 'collected' ? '#28A745' :
                             item.status === 'confirmed' ? '#FFC107' : '#007AFF',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff' }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Customer ID */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#34495E', minWidth: 100 }}>
              Customer ID:
            </Text>
            <Text style={{ fontSize: 14, color: '#7F8C8D', fontFamily: 'monospace' }}>
              {item.customerId}
            </Text>
          </View>

          {/* Products */}
          {item.products.map((product, index) => (
            <View key={product.id} style={{
              backgroundColor: '#F8F9FA',
              borderRadius: 8,
              padding: 12,
              marginBottom: index < item.products.length - 1 ? 8 : 0,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Product Image */}
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  marginRight: 12,
                  backgroundColor: '#E9ECEF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}>
                  {product.image ? (
                    <Image
                      source={{ uri: product.image }}
                      style={{ width: 60, height: 60, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 24 }}>📦</Text>
                  )}
                </View>

                {/* Product Details */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 4 }}>
                    {product.name}
                  </Text>

                  {/* Product ID */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#34495E', minWidth: 80 }}>
                      Product ID:
                    </Text>
                    <Text style={{ fontSize: 12, color: '#7F8C8D', fontFamily: 'monospace' }}>
                      {product.productId}
                    </Text>
                  </View>

                  {/* Price and Quantity */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#28A745' }}>
                        €{product.price.toFixed(2)}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#7F8C8D', marginLeft: 8 }}>
                        × {product.requestedQuantity}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C3E50' }}>
                      €{(product.price * product.requestedQuantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {/* Footer */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#E9ECEF',
          }}>
            <Text style={{ fontSize: 12, color: '#7F8C8D' }}>
              Created: {item.createdAt instanceof Date ?
                item.createdAt.toLocaleDateString() :
                new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.status === 'pending' && !confirmedReservations.has(item.id) && (
                <TouchableOpacity
                  style={{
                    backgroundColor: confirmingReservations.has(item.id) ? '#6c757d' : '#28A745',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 6,
                    marginRight: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (!confirmingReservations.has(item.id)) {
                      
                      setConfirmingReservations(prev => new Set(prev).add(item.id));
                      dispatch(confirmReservation(item.id))
                        .unwrap()
                        .then(() => {
                          setConfirmingReservations(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(item.id);
                            return newSet;
                          });
                          setConfirmedReservations(prev => new Set(prev).add(item.id));
                          // Remove confirmed status after 3 seconds
                          setTimeout(() => {
                            setConfirmedReservations(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(item.id);
                              return newSet;
                            });
                          }, 3000);
                        })
                        .catch(() => {
                          setConfirmingReservations(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(item.id);
                            return newSet;
                          });
                        });
                    }
                  }}
                  disabled={confirmingReservations.has(item.id)}
                >
                  {confirmingReservations.has(item.id) ? (
                    <>
                      <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                        Confirming...
                      </Text>
                    </>
                  ) : (
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                      Confirm
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {confirmedReservations.has(item.id) && (
                <View style={{
                  backgroundColor: '#28A745',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                  marginRight: 12,
                }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                    Reservation Confirmed
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: '#0a7ea4',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  alert( item.id)
                  console.log('View button pressed for reservation:', item.id);
                  // Add view functionality here
                }}
              >
                
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={() => <>{headerComponent}</>}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No reservations found
          </Text>
        </View>
      }
    />
  );
};
