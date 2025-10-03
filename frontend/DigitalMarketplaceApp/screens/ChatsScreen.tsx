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

interface ChatsScreenProps {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
}

const ChatsScreen: React.FC<ChatsScreenProps> = ({ user }) => {
  // Mock data - in real app this would come from backend
  const mockChats = [
    {
      id: '1',
      userName: 'דני כהן',
      userAvatar: 'https://via.placeholder.com/50/4A90E2/ffffff?text=ד',
      lastMessage: 'שלום, האם הכרטיסים עדיין זמינים?',
      lastMessageTime: '14:30',
      unreadCount: 2,
      itemTitle: 'כרטיסים להופעה של עומר אדם',
      itemPrice: 150,
    },
    {
      id: '2',
      userName: 'שרה לוי',
      userAvatar: 'https://via.placeholder.com/50/4A90E2/ffffff?text=ש',
      lastMessage: 'תודה רבה! הכרטיסים הגיעו',
      lastMessageTime: 'אתמול',
      unreadCount: 0,
      itemTitle: 'כרטיסים למשחק מכבי תל אביב',
      itemPrice: 80,
    },
    {
      id: '3',
      userName: 'מיכאל גולד',
      userAvatar: 'https://via.placeholder.com/50/4A90E2/ffffff?text=מ',
      lastMessage: 'איזה זמן מתאים לך למסירה?',
      lastMessageTime: '12:15',
      unreadCount: 1,
      itemTitle: 'שוברים למסעדה',
      itemPrice: 200,
    },
  ];

  const getUnreadBadge = (count: number) => {
    if (count === 0) return null;
    
    return (
      <View style={styles.unreadBadge}>
        <Text style={styles.unreadText}>{count}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>צ'אטים</Text>
          <Text style={styles.headerSubtitle}>הודעות מהלקוחות שלך</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockChats.length}</Text>
            <Text style={styles.statLabel}>שיחות</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockChats.reduce((sum, chat) => sum + chat.unreadCount, 0)}</Text>
            <Text style={styles.statLabel}>הודעות לא נקראו</Text>
          </View>
        </View>

        {/* Chats List */}
        <View style={styles.chatsContainer}>
          {mockChats.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>אין הודעות עדיין</Text>
              <Text style={styles.emptySubtitle}>כשיקבלו הודעות מהלקוחות, הן יופיעו כאן</Text>
            </View>
          ) : (
            mockChats.map((chat) => (
              <TouchableOpacity key={chat.id} style={styles.chatCard}>
                <View style={styles.chatAvatar}>
                  <Image source={{ uri: chat.userAvatar }} style={styles.avatarImage} />
                  {getUnreadBadge(chat.unreadCount)}
                </View>
                
                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatUserName}>{chat.userName}</Text>
                    <Text style={styles.chatTime}>{chat.lastMessageTime}</Text>
                  </View>
                  
                  <Text style={styles.chatItemTitle}>{chat.itemTitle}</Text>
                  <Text style={styles.chatItemPrice}>₪{chat.itemPrice}</Text>
                  
                  <Text 
                    style={[
                      styles.chatLastMessage,
                      chat.unreadCount > 0 && styles.unreadMessage
                    ]}
                    numberOfLines={2}
                  >
                    {chat.lastMessage}
                  </Text>
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
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  chatsContainer: {
    paddingHorizontal: 20,
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
  chatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  chatAvatar: {
    position: 'relative',
    marginLeft: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chatItemTitle: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
    marginBottom: 2,
    textAlign: 'right',
  },
  chatItemPrice: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    lineHeight: 20,
  },
  unreadMessage: {
    color: '#1F2937',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default ChatsScreen;
