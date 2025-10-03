import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

interface ProfileScreenProps {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleLogout = () => {
    Alert.alert(
      'התנתקות',
      'האם אתם בטוחים שברצונכם להתנתק?',
      [
        { text: 'ביטול', style: 'cancel' },
        { text: 'התנתק', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  const pickImage = async () => {
    const options = [
      { text: 'צלם תמונה', onPress: openCamera },
      { text: 'בחר מהספרייה', onPress: openGallery },
    ];

    // אם יש תמונה אמיתית (לא placeholder), הוסף אפשרות למחיקה
    if (profileImage && !profileImage.includes('placeholder')) {
      options.push({ text: 'מחק תמונה', onPress: deleteImage, style: 'destructive' });
    }

    options.push({ text: 'ביטול', style: 'cancel' });

    Alert.alert(
      'בחר תמונת פרופיל',
      'איך תרצה להוסיף תמונה?',
      options,
      { cancelable: true }
    );
  };

  const deleteImage = () => {
    Alert.alert(
      'מחיקת תמונה',
      'האם אתם בטוחים שברצונכם למחוק את תמונת הפרופיל?',
      [
        { text: 'ביטול', style: 'cancel' },
        { 
          text: 'מחק', 
          style: 'destructive', 
          onPress: () => setProfileImage(null) 
        }
      ]
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('שגיאה', 'נדרשת הרשאה לגישה למצלמה');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('שגיאה', 'נדרשת הרשאה לגישה לאלבום');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const menuItems = [
    { title: 'הפרסומים שלי', icon: '📦', onPress: () => Alert.alert('הפרסומים שלי', 'כאן יוצגו הפרסומים שפרסמתם') },
    { title: 'הצעות שהגשתי', icon: '🛒', onPress: () => Alert.alert('הצעות שהגשתי', 'כאן יוצגו ההצעות שהגשתם') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Simple Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>הפרופיל שלי</Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
              <Image
                source={{ uri: profileImage || 'https://via.placeholder.com/100/4A90E2/ffffff?text=📷' }}
                style={styles.profileImage}
              />
              <View style={styles.onlineIndicator} />
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statNumberContainer}>
                  <Text style={styles.statNumber}>0</Text>
                </View>
                <Text style={styles.statLabel}>פרסומים פעילים</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.statNumberContainer}>
                  <Text style={styles.statNumber}>0</Text>
                </View>
                <Text style={styles.statLabel}>מכירות</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingStars}>★★★★★</Text>
                  <Text style={styles.ratingNumber}>5.0</Text>
                </View>
                <Text style={styles.statLabel}>דירוג</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>פעולות</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <Text style={styles.menuArrow}>‹</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutButtonText}>התנתק מהחשבון</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom Spacer for Navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  profileSection: {
    backgroundColor: 'transparent',
    padding: 20,
    alignItems: 'center',
    marginTop: -15,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.1)',
    width: '100%',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconText: {
    fontSize: 20,
    color: '#4A90E2',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    minHeight: 80,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 60,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  statNumberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4285f4',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  ratingStars: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 2,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    padding: 20,
    paddingBottom: 10,
    textAlign: 'right',
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 20,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    textAlign: 'right',
    fontWeight: '500',
    marginRight: 8,
  },
  menuArrow: {
    fontSize: 20,
    color: '#4A90E2',
    marginLeft: 20,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bottomSpacer: {
    height: 60, // Fixed space for bottom navigation
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default ProfileScreen;
