import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { signInWithGoogle, GoogleUser } from '../services/googleAuth';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  const sendUserToBackend = async (googleUser: GoogleUser) => {
    try {
      const response = await fetch('http://10.100.102.37:5201/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${googleUser.idToken}`,
        },
        body: JSON.stringify({
          uid: googleUser.id,
          email: googleUser.email,
          displayName: googleUser.name,
          photoURL: googleUser.picture,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();
      console.log('User saved to backend:', result);
      return result;
    } catch (error) {
      console.error('Error sending user to backend:', error);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      // Real Google Sign-In
      const googleUser = await signInWithGoogle();
      
      // Send to backend
      await sendUserToBackend(googleUser);
      
      // Convert to our User format
      const user: User = {
        uid: googleUser.id,
        email: googleUser.email,
        displayName: googleUser.name,
        photoURL: googleUser.picture,
      };
      
      Alert.alert('התחברות הצליחה!', `שלום ${user.displayName}`);
      onLoginSuccess(user);
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('שגיאה', 'ההתחברות נכשלה. נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Digital Marketplace</Text>
          <Text style={styles.subtitle}>השוק הדיגיטלי הישראלי</Text>
          <Text style={styles.description}>
            מקום לקנות ולמכור שירותים דיגיטליים{'\n'}
            עיצוב, פיתוח, כתיבה ועוד
          </Text>
        </View>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <Text style={styles.loginTitle}>התחברות למערכת</Text>
          
          <TouchableOpacity 
            style={[styles.googleButton, loading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <View style={styles.googleButtonContent}>
              {loading ? (
                <ActivityIndicator size="small" color="#4285f4" />
              ) : (
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
              )}
              <Text style={styles.googleButtonText}>
                {loading ? 'מתחבר...' : 'Continue with Google'}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            בהתחברות אתם מסכימים לתנאי השימוש ומדיניות הפרטיות
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#4285f4',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  loginSection: {
    marginBottom: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 32,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  disabledButton: {
    opacity: 0.6,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  googleIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  googleButtonText: {
    fontSize: 16,
    color: '#3c4043',
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;