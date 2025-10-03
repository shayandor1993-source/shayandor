import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

interface AddItemScreenProps {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
}

const AddItemScreen: React.FC<AddItemScreenProps> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    description: false,
    price: false,
    category: false,
  });

  const addImage = async () => {
    if (images.length >= 3) {
      Alert.alert('הגבלה', 'ניתן להעלות עד 3 תמונות בלבד');
      return;
    }

    Alert.alert(
      'הוסף תמונה',
      'איך תרצה להוסיף תמונה?',
      [
        { text: 'צלם תמונה', onPress: openCamera },
        { text: 'בחר מהספרייה', onPress: openGallery },
        { text: 'ביטול', style: 'cancel' },
      ],
      { cancelable: true }
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
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('שגיאה', 'נדרשת הרשאה לגישה לאלבום');
      return;
    }

    const remainingSlots = 3 - images.length;
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      const totalImages = images.length + newImages.length;
      
      if (totalImages > 3) {
        Alert.alert('הגבלה', `ניתן להעלות עד 3 תמונות בלבד. נבחרו ${newImages.length} תמונות אבל ניתן להוסיף רק ${remainingSlots}.`);
        const allowedImages = newImages.slice(0, remainingSlots);
        setImages(prev => [...prev, ...allowedImages]);
      } else {
        setImages(prev => [...prev, ...newImages]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!title || !description || !price || !category) {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות הנדרשים');
      return;
    }

    setIsPublishing(true);
    
    // Simulate publishing delay
    setTimeout(() => {
      setIsPublishing(false);
      Alert.alert(
        'הפריט פורסם! 🎉',
        `הפריט "${title}" פורסם בהצלחה במחיר ₪${price}`,
        [{ text: 'מעולה!', onPress: () => {
          setTitle('');
          setDescription('');
          setPrice('');
          setCategory('');
          setImages([]);
        }}]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professional Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>פרסם מודעה חדשה</Text>
          <Text style={styles.headerSubtitle}>מכר כרטיסים ושוברים בבטחה</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userInfoCard}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatarContainer}>
              <Image
                source={{ uri: user.photoURL || 'https://via.placeholder.com/60/4A90E2/ffffff?text=👤' }}
                style={styles.userAvatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.displayName}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.sellerBadge}>
                <Text style={styles.sellerBadgeText}>מוכר מאומת</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Title Section */}
          <View style={styles.inputSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.required}>* </Text>
              <Text style={styles.label}>כותרת המודעה</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, touchedFields.title && !title && styles.inputError]}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (!touchedFields.title) {
                    setTouchedFields(prev => ({ ...prev, title: true }));
                  }
                }}
                onBlur={() => setTouchedFields(prev => ({ ...prev, title: true }))}
                placeholder="שני כרטיסים להופעה של עומר אדם"
                placeholderTextColor="#9CA3AF"
                textAlign="right"
              />
              {touchedFields.title && !title && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>נדרש להזין כותרת למודעה</Text>
                </View>
              )}
            </View>
          </View>

          {/* Category Section */}
          <View style={styles.inputSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.required}>* </Text>
              <Text style={styles.label}>סוג הפריט</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={[styles.categoryScroll, { transform: [{ scaleX: -1 }] }]}
              contentContainerStyle={styles.categoryScrollContent}
              directionalLockEnabled={true}
            >
              <View style={styles.categoryButtons}>
                {[
                  { name: 'אחר', icon: '🎫' },
                  { name: 'שוברים', icon: '🎁' },
                  { name: 'כרטיסי סטנדאפ', icon: '🎤' },
                  { name: 'כרטיסי הופעות', icon: '🎵' },
                  { name: 'כרטיסי ספורט', icon: '⚽' }
                ].map((cat, index) => (
                  <TouchableOpacity
                    key={cat.name}
                    style={[
                      styles.categoryButton,
                      category === cat.name && styles.categoryButtonActive,
                      index === 0 && styles.firstCategoryButton
                    ]}
                    onPress={() => {
                      setCategory(cat.name);
                      setTouchedFields(prev => ({ ...prev, category: true }));
                    }}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={[
                      styles.categoryButtonText,
                      category === cat.name && styles.categoryButtonTextActive
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {touchedFields.category && !category && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>נדרש לבחור סוג פריט</Text>
              </View>
            )}
          </View>

          {/* Images Section */}
          <View style={styles.inputSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>תמונות </Text>
              <Text style={styles.labelSubtext}>(עד 3 תמונות)</Text>
            </View>
            <View style={styles.imagesGrid}>
              {images.length < 3 && (
                <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
                  <Text style={styles.addImageText}>+ הוסף תמונות</Text>
                  <Text style={styles.addImageSubtext}>עד {3 - images.length} תמונות</Text>
                </TouchableOpacity>
              )}
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removeImageButton} 
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.inputSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.required}>* </Text>
              <Text style={styles.label}>תיאור המודעה</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.textArea, touchedFields.description && !description && styles.inputError]}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (!touchedFields.description) {
                    setTouchedFields(prev => ({ ...prev, description: true }));
                  }
                }}
                onBlur={() => setTouchedFields(prev => ({ ...prev, description: true }))}
                placeholder="תאר את הכרטיסים/שוברים: איזה אירוע? תאריך? מיקום? מקום ישיבה? מחיר מקורי?"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={5}
                textAlign="right"
                textAlignVertical="top"
              />
              {touchedFields.description && !description && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>נדרש להזין תיאור למודעה</Text>
                </View>
              )}
              <Text style={styles.charCount}>{description.length}/50</Text>
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.inputSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.required}>* </Text>
              <Text style={styles.label}>מחיר למכירה</Text>
            </View>
            <View style={[styles.priceInputWrapper, touchedFields.price && !price && styles.inputError]}>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  if (!touchedFields.price) {
                    setTouchedFields(prev => ({ ...prev, price: true }));
                  }
                }}
                onBlur={() => setTouchedFields(prev => ({ ...prev, price: true }))}
                placeholder="250"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                textAlign="right"
              />
              <Text style={styles.currencySymbol}>₪</Text>
            </View>
            {touchedFields.price && !price && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>נדרש להזין מחיר</Text>
              </View>
            )}
            <Text style={styles.priceHint}>הזן את המחיר הרצוי למכירה</Text>
          </View>

          {/* Publish Button */}
          <View style={styles.publishContainer}>
            <TouchableOpacity 
              style={[styles.publishButton, isPublishing && styles.publishButtonDisabled]} 
              onPress={handlePublish}
              disabled={isPublishing}
            >
              <Text style={styles.publishButtonText}>
                {isPublishing ? 'מפרסם מודעה...' : '🚀 פרסם מודעה עכשיו'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 4,
    writingDirection: 'rtl',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  userInfoCard: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 20,
  },
  userAvatarContainer: {
    position: 'relative',
    marginLeft: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'right',
  },
  sellerBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  sellerBadgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    textAlign: 'right',
  },
  formCard: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.1)',
  },
  inputSection: {
    marginBottom: 30,
  },
  labelContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
    width: '100%',
  },
  labelIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'right',
  },
  required: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 8,
  },
  labelSubtext: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'right',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1F2937',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorContainer: {
    marginTop: 12,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'right',
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryScrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  categoryButtons: {
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 25,
    transform: [{ scaleX: -1 }],
    alignItems: 'flex-start',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#ffffff',
    marginLeft: 12,
    minHeight: 56,
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  firstCategoryButton: {
    marginLeft: 0,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  addImageButton: {
    width: 120,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  addImageSubtext: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  previewImage: {
    width: 120,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  removeImageText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceInputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    paddingVertical: 12,
  },
  priceHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  publishContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  publishButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#059669',
  },
  publishButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  publishButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSpacer: {
    height: 80,
  },
});

export default AddItemScreen;
