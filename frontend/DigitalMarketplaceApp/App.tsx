import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { handleGoogleCallback, initializeGoogleSignIn } from './services/googleAuth';
import LoginScreen from './screens/LoginScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import AddItemScreen from './screens/AddItemScreen';
import MyListingsScreen from './screens/MyListingsScreen';
import ChatsScreen from './screens/ChatsScreen';
import ProfileScreen from './screens/ProfileScreen';
// Initialize Firebase
import './firebaseConfig';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on app start and check for OAuth callback
  useEffect(() => {
    loadUserFromStorage();
    checkForOAuthCallback();
    // Initialize Google Sign-In
    initializeGoogleSignIn();
  }, []);

  const checkForOAuthCallback = () => {
    // Check if we're on web and have a code in the URL
    if (typeof window !== 'undefined' && window.location) {
      const currentUrl = window.location.href;
      const googleUser = handleGoogleCallback(currentUrl);
      
      if (googleUser) {
        // Convert GoogleUser to our User format
        const user: User = {
          uid: googleUser.id,
          email: googleUser.email,
          displayName: googleUser.name,
          photoURL: googleUser.picture,
        };
        
        // Save user and set state
        handleLoginSuccess(user);
        
        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user to storage:', error);
      setUser(userData);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error removing user from storage:', error);
      setUser(null);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  if (!user) {
    return (
      <>
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            height: 100,
            paddingBottom: 35,
            paddingTop: 12,
            paddingHorizontal: 15,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -6,
            },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 25,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 35,
            position: 'absolute',
          },
              tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: '700',
            marginTop: 6,
            letterSpacing: 0.2,
            textAlign: 'center',
            lineHeight: 11,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Profile"
          options={{
            tabBarLabel: 'פרופיל',
                tabBarIcon: ({ color, size, focused }) => (
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: focused ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                  }}>
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: focused ? '#ffffff' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: focused ? 2 : 0,
                      borderColor: focused ? '#4A90E2' : 'transparent',
                    }}>
                      <Text style={{ 
                        fontSize: 16, 
                        color: focused ? '#4A90E2' : color,
                        fontWeight: focused ? 'bold' : 'normal'
                      }}>
                        👤
                      </Text>
                    </View>
                  </View>
                ),
          }}
        >
          {() => <ProfileScreen user={user} onLogout={handleLogout} />}
        </Tab.Screen>
        
        <Tab.Screen
          name="Chats"
          options={{
            tabBarLabel: 'צ\'אטים',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: focused ? '#ffffff' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: focused ? 2 : 0,
                  borderColor: focused ? '#4A90E2' : 'transparent',
                }}>
                  <Text style={{ 
                    fontSize: 16, 
                    color: focused ? '#4A90E2' : color,
                    fontWeight: focused ? 'bold' : 'normal'
                  }}>
                    💬
                  </Text>
                </View>
              </View>
            ),
          }}
        >
          {() => <ChatsScreen user={user} />}
        </Tab.Screen>

        <Tab.Screen
          name="AddItem"
          options={{
            tabBarLabel: 'פרסם',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -15,
              }}>
                <View style={{
                  width: 65,
                  height: 65,
                  borderRadius: 32.5,
                      backgroundColor: '#4A90E2',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#4A90E2',
                  shadowOffset: {
                    width: 0,
                    height: 8,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 15,
                  borderWidth: 4,
                  borderColor: '#ffffff',
                }}>
                  <Text style={{ 
                    fontSize: 28, 
                    color: '#fff',
                    fontWeight: 'bold',
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: {width: 0, height: 2},
                    textShadowRadius: 4,
                  }}>
                    +
                  </Text>
                </View>
              </View>
            ),
            tabBarLabelStyle: {
              fontSize: 9,
              fontWeight: '700',
                  color: '#4A90E2',
              marginTop: 12,
              textAlign: 'center',
              lineHeight: 11,
            },
          }}
        >
          {() => <AddItemScreen user={user} />}
        </Tab.Screen>

        <Tab.Screen
          name="MyListings"
          options={{
            tabBarLabel: 'הפרסומים שלי',
            tabBarLabelStyle: {
              fontSize: 8,
              fontWeight: '700',
              marginTop: 6,
              letterSpacing: 0.1,
              textAlign: 'center',
              lineHeight: 10,
            },
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: focused ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: focused ? '#ffffff' : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: focused ? 2 : 0,
                  borderColor: focused ? '#4A90E2' : 'transparent',
                }}>
                  <Text style={{ 
                    fontSize: 16, 
                    color: focused ? '#4A90E2' : color,
                    fontWeight: focused ? 'bold' : 'normal'
                  }}>
                    📝
                  </Text>
                </View>
              </View>
            ),
          }}
        >
          {() => <MyListingsScreen user={user} />}
        </Tab.Screen>
        
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: 'בית',
                tabBarIcon: ({ color, size, focused }) => (
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: focused ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                  }}>
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: focused ? '#ffffff' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: focused ? 2 : 0,
                      borderColor: focused ? '#4A90E2' : 'transparent',
                    }}>
                      <Text style={{ 
                        fontSize: 16, 
                        color: focused ? '#4A90E2' : color,
                        fontWeight: focused ? 'bold' : 'normal'
                      }}>
                        🏠
                      </Text>
                    </View>
                  </View>
                ),
          }}
        >
          {() => <MarketplaceScreen user={user} onLogout={handleLogout} />}
        </Tab.Screen>
        </Tab.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
