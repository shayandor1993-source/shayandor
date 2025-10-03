import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface TicketItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  seller: string;
  sellerAvatar: string;
  rating: number;
  images: string[];
  location: string;
  date: string;
  time: string;
  venue: string;
}

interface MarketplaceScreenProps {
  user: User;
  onLogout: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const CARD_HEIGHT = screenHeight * 0.5;

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [passedItems, setPassedItems] = useState<number[]>([]);
  
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  const mockTickets: TicketItem[] = [
    {
      id: 1,
      title: 'כרטיסים להופעה של עומר אדם',
      description: '2 כרטיסים להופעה מדהימה של עומר אדם באולם היכל התרבות',
      price: 180,
      category: 'כרטיסי הופעות',
      seller: 'דני כהן',
      sellerAvatar: 'https://via.placeholder.com/60/4A90E2/ffffff?text=ד',
      rating: 4.9,
      images: [
        'https://via.placeholder.com/300/4A90E2/ffffff?text=🎵',
        'https://via.placeholder.com/300/4A90E2/ffffff?text=🎤',
      ],
      location: 'תל אביב',
      date: '15.03.2024',
      time: '20:00',
      venue: 'היכל התרבות',
    },
    {
      id: 2,
      title: 'כרטיסים למשחק מכבי תל אביב',
      description: 'כרטיסים למשחק כדורסל מרגש נגד הפועל ירושלים',
      price: 120,
      category: 'כרטיסי ספורט',
      seller: 'שרה לוי',
      sellerAvatar: 'https://via.placeholder.com/60/4A90E2/ffffff?text=ש',
      rating: 4.8,
      images: [
        'https://via.placeholder.com/300/4A90E2/ffffff?text=⚽',
        'https://via.placeholder.com/300/4A90E2/ffffff?text=🏀',
      ],
      location: 'תל אביב',
      date: '22.03.2024',
      time: '19:30',
      venue: 'היכל נוקיה',
    },
    {
      id: 3,
      title: 'כרטיסים לסטנדאפ של אסי כהן',
      description: 'כרטיסים להופעת סטנדאפ מצחיקה של אסי כהן',
      price: 90,
      category: 'כרטיסי סטנדאפ',
      seller: 'מיכאל גולד',
      sellerAvatar: 'https://via.placeholder.com/60/4A90E2/ffffff?text=מ',
      rating: 4.7,
      images: [
        'https://via.placeholder.com/300/4A90E2/ffffff?text=😂',
        'https://via.placeholder.com/300/4A90E2/ffffff?text=🎭',
      ],
      location: 'חיפה',
      date: '28.03.2024',
      time: '21:00',
      venue: 'תיאטרון חיפה',
    },
    {
      id: 4,
      title: 'שוברים למסעדה יוקרתית',
      description: 'שוברים בשווי 300 ש"ח למסעדה יוקרתית בתל אביב',
      price: 200,
      category: 'שוברים',
      seller: 'רונית אברהם',
      sellerAvatar: 'https://via.placeholder.com/60/4A90E2/ffffff?text=ר',
      rating: 4.9,
      images: [
        'https://via.placeholder.com/300/4A90E2/ffffff?text=🍽️',
        'https://via.placeholder.com/300/4A90E2/ffffff?text=🍷',
      ],
      location: 'תל אביב',
      date: 'תקף עד 30.06.2024',
      time: 'כל יום',
      venue: 'מסעדת גורמה',
    },
  ];

  const filteredTickets = mockTickets.filter(ticket => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.trim();
    const searchableText = [
      ticket.title,
      ticket.seller,
      ticket.category,
      ticket.description,
      ticket.venue,
      ticket.location
    ].join(' ');
    
    // Check for exact matches first (case insensitive)
    if (searchableText.includes(query)) return true;
    
    // Check for partial word matches
    const words = query.split(' ').filter(word => word.length > 0);
    return words.every(word => searchableText.includes(word));
  });

  const currentTicket = filteredTickets[currentIndex];

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        const { translationX } = event.nativeEvent;
        // Update rotation based on translation for smooth effect
        const rotationValue = translationX * 0.1;
        rotate.setValue(rotationValue);
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY, velocityX } = event.nativeEvent;
      
      // Optimized Tinder-like swipe detection based on research
      const swipeThreshold = 100; // Optimal distance threshold
      const velocityThreshold = 0.8; // Optimal velocity threshold
      const minSwipeDistance = 60; // Minimum distance for swipe
      
      // Calculate swipe strength (combination of distance and velocity)
      const swipeStrength = Math.abs(translationX) + (Math.abs(velocityX) * 20);
      const isStrongSwipe = swipeStrength > 120;
      
      // Check for right swipe (Like)
      if (translationX > swipeThreshold && (isStrongSwipe || velocityX > velocityThreshold)) {
        animateCardOut('right');
      } 
      // Check for left swipe (Pass)
      else if (translationX < -swipeThreshold && (isStrongSwipe || velocityX < -velocityThreshold)) {
        animateCardOut('left');
      } 
      // Return to center with natural spring animation
      else {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 9,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 9,
          }),
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 9,
          }),
        ]).start();
      }
    }
  };

  const animateCardOut = (direction: 'left' | 'right') => {
    const toValue = direction === 'right' ? screenWidth + 100 : -screenWidth - 100;
    const rotationValue = direction === 'right' ? 25 : -25;
    
    Animated.parallel([
      Animated.spring(translateX, {
        toValue,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: direction === 'right' ? -30 : 30,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
      Animated.spring(rotate, {
        toValue: rotationValue,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }),
    ]).start(() => {
      if (direction === 'right') {
        handleLike();
      } else {
        handlePass();
      }
    });
  };

  const handleLike = () => {
    if (currentTicket) {
      setLikedItems([...likedItems, currentTicket.id]);
      Alert.alert(
        '🎉 מעולה!',
        `פתחת צ'אט עם ${currentTicket.seller}`,
        [{ text: 'אוקיי', onPress: () => nextCard() }]
      );
    }
  };

  const handlePass = () => {
    if (currentTicket) {
      setPassedItems([...passedItems, currentTicket.id]);
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentIndex < filteredTickets.length - 1) {
      setCurrentIndex(currentIndex + 1);
      translateX.setValue(0);
      translateY.setValue(0);
      rotate.setValue(0);
    } else {
      Alert.alert(
        '🎯 סיימת!',
        'ראית את כל הכרטיסים הזמינים. נסה לחפש משהו אחר!',
        [{ text: 'אוקיי', onPress: () => {
          setCurrentIndex(0);
          setSearchQuery('');
        }}]
      );
    }
  };

  // Reset index when search changes
  React.useEffect(() => {
    setCurrentIndex(0);
    translateX.setValue(0);
    translateY.setValue(0);
    rotate.setValue(0);
  }, [searchQuery]);

  const getCardStyle = () => {
    const rotateInterpolate = translateX.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-20deg', '0deg', '20deg'],
      extrapolate: 'clamp',
    });

    const scaleInterpolate = translateX.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: [0.95, 1, 0.95],
      extrapolate: 'clamp',
    });

    const opacityInterpolate = translateX.interpolate({
      inputRange: [-200, -100, 0, 100, 200],
      outputRange: [0.7, 0.8, 1, 0.8, 0.7],
      extrapolate: 'clamp',
    });

    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: rotateInterpolate },
        { scale: scaleInterpolate },
      ],
      opacity: opacityInterpolate,
    };
  };

  const getLikeOpacity = () => {
    return translateX.interpolate({
      inputRange: [0, 60, 100],
      outputRange: [0, 0.2, 1],
      extrapolate: 'clamp',
    });
  };

  const getPassOpacity = () => {
    return translateX.interpolate({
      inputRange: [-100, -60, 0],
      outputRange: [1, 0.2, 0],
      extrapolate: 'clamp',
    });
  };

  if (!currentTicket) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎫 כרטיסים</Text>
          <Text style={styles.headerSubtitle}>מצא את הכרטיס המושלם</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="חפש כרטיסים..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>לא נמצאו כרטיסים</Text>
          <Text style={styles.emptySubtitle}>נסה לחפש משהו אחר</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>🎫 כרטיסים</Text>
          <Text style={styles.headerSubtitle}>מצא את הכרטיס המושלם</Text>
        </View>
        {/* Card Counter - Top Right */}
        <View style={styles.counterContainer}>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {currentIndex + 1} מתוך {filteredTickets.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="חפש: עומר אדם, מכבי, סטנדאפ, תל אביב..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Card Stack */}
      <View style={styles.cardContainer}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          activeOffsetX={[-15, 15]}
          activeOffsetY={[-10, 10]}
          shouldCancelWhenOutside={false}
        >
          <Animated.View style={[styles.card, getCardStyle()]}>
            {/* Card Image */}
            <View style={styles.cardImageContainer}>
              <Image
                source={{ uri: currentTicket.images[0] }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              
              {/* Like/Pass Overlays */}
              <Animated.View style={[styles.likeOverlay, { opacity: getLikeOpacity() }]}>
                <Text style={styles.likeText}>LIKE</Text>
              </Animated.View>
              
              <Animated.View style={[styles.passOverlay, { opacity: getPassOpacity() }]}>
                <Text style={styles.passText}>PASS</Text>
              </Animated.View>
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{currentTicket.title}</Text>
                <Text style={styles.cardPrice}>₪{currentTicket.price}</Text>
              </View>

              <Text style={styles.cardDescription}>{currentTicket.description}</Text>

              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📍</Text>
                  <Text style={styles.detailText}>{currentTicket.venue}, {currentTicket.location}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>📅</Text>
                  <Text style={styles.detailText}>{currentTicket.date} בשעה {currentTicket.time}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailIcon}>🏷️</Text>
                  <Text style={styles.detailText}>{currentTicket.category}</Text>
                </View>
              </View>

              {/* Seller Info */}
              <View style={styles.sellerContainer}>
                <Image
                  source={{ uri: currentTicket.sellerAvatar }}
                  style={styles.sellerAvatar}
                />
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{currentTicket.seller}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>⭐ {currentTicket.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Text style={styles.passButtonText}>✕</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.likeButtonText}>♥</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          החלק שמאלה לדחייה • החלק ימינה לצ'אט
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    alignItems: 'center',
    flex: 1,
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    textAlign: 'right',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  counterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  counterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counterText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
  },
  cardImageContainer: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  likeOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: '15deg' }],
  },
  likeText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  passOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
  },
  passText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
    marginRight: 12,
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  cardDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'right',
  },
  cardDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    textAlign: 'right',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ratingText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    paddingBottom: 30,
  },
  passButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  passButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  likeButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  likeButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MarketplaceScreen;