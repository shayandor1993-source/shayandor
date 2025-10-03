import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MyListingsScreenProps {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
}

const MyListingsScreen: React.FC<MyListingsScreenProps> = ({ user }) => {
  // Mock data - in real app this would come from backend
  const mockListings = [
    {
      id: '1',
      title: 'כרטיסים להופעה של עומר אדם',
      price: 150,
      category: 'כרטיסי הופעות',
      image: 'https://via.placeholder.com/150/4A90E2/ffffff?text=🎵',
      status: 'active',
      views: 24,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'כרטיסים למשחק מכבי תל אביב',
      price: 80,
      category: 'כרטיסי ספורט',
      image: 'https://via.placeholder.com/150/4A90E2/ffffff?text=⚽',
      status: 'sold',
      views: 45,
      createdAt: '2024-01-10',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'sold': return '#6B7280';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'sold': return 'נמכר';
      case 'pending': return 'ממתין';
      default: return 'לא ידוע';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>הפרסומים שלי</Text>
          <Text style={styles.headerSubtitle}>ניהול המודעות שלך</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockListings.length}</Text>
            <Text style={styles.statLabel}>מודעות</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockListings.filter(l => l.status === 'active').length}</Text>
            <Text style={styles.statLabel}>פעילות</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockListings.filter(l => l.status === 'sold').length}</Text>
            <Text style={styles.statLabel}>נמכרו</Text>
          </View>
        </View>

        {/* Listings */}
        <View style={styles.listingsContainer}>
          <Text style={styles.sectionTitle}>המודעות שלך</Text>
          
          {mockListings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>אין מודעות עדיין</Text>
              <Text style={styles.emptySubtitle}>התחל לפרסם את הכרטיסים שלך</Text>
            </View>
          ) : (
            mockListings.map((listing) => (
              <TouchableOpacity key={listing.id} style={styles.listingCard}>
                <Image source={{ uri: listing.image }} style={styles.listingImage} />
                <View style={styles.listingContent}>
                  <View style={styles.listingHeader}>
                    <Text style={styles.listingTitle}>{listing.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(listing.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(listing.status)}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.listingCategory}>{listing.category}</Text>
                  
                  <View style={styles.listingFooter}>
                    <Text style={styles.listingPrice}>₪{listing.price}</Text>
                    <Text style={styles.listingViews}>{listing.views} צפיות</Text>
                  </View>
                  
                  <Text style={styles.listingDate}>פורסם ב-{listing.createdAt}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  listingsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  listingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginLeft: 12,
  },
  listingContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  listingCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'right',
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  listingViews: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  listingDate: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default MyListingsScreen;
