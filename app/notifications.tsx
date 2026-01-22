import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    useFonts as useManropeFonts,
} from "@expo-google-fonts/manrope";
import {
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    useFonts as useQuicksandFonts,
} from "@expo-google-fonts/quicksand";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

interface Notification {
  id: number;
  type: "deal" | "expiring" | "promo" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  iconColor: string;
  iconBg: string;
}

const notificationsData: Notification[] = [
  {
    id: 1,
    type: "deal",
    title: "New Deal Alert!",
    message:
      "Pizza Paradise just added a 50% off deal on their signature pizzas.",
    time: "2 min ago",
    read: false,
    icon: "tag",
    iconColor: Colors.orange,
    iconBg: `${Colors.orange}15`,
  },
  {
    id: 2,
    type: "expiring",
    title: "Deal Expiring Soon",
    message: "Your Cafe Nero coupon expires in 2 hours. Use it now!",
    time: "15 min ago",
    read: false,
    icon: "clock",
    iconColor: "#E74C3C",
    iconBg: "#E74C3C15",
  },
  {
    id: 3,
    type: "promo",
    title: "Weekend Special 🎉",
    message: "Get extra 10% off on all restaurant deals this weekend.",
    time: "1 hour ago",
    read: false,
    icon: "gift",
    iconColor: Colors.purple,
    iconBg: `${Colors.purple}15`,
  },
  {
    id: 4,
    type: "system",
    title: "Welcome to QPON!",
    message: "Thanks for joining. Start exploring amazing deals near you.",
    time: "2 hours ago",
    read: true,
    icon: "check-circle",
    iconColor: Colors.teal,
    iconBg: `${Colors.teal}15`,
  },
  {
    id: 5,
    type: "deal",
    title: "Nearby Deal Found",
    message: "Coffee Corner is offering 40% off, just 250m away from you!",
    time: "3 hours ago",
    read: true,
    icon: "map-pin",
    iconColor: Colors.deepNavy,
    iconBg: `${Colors.deepNavy}15`,
  },
  {
    id: 6,
    type: "promo",
    title: "Flash Sale Live!",
    message: "Limited time: Get up to 60% off on selected spa treatments.",
    time: "5 hours ago",
    read: true,
    icon: "zap",
    iconColor: "#F39C12",
    iconBg: "#F39C1215",
  },
  {
    id: 7,
    type: "system",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated.",
    time: "Yesterday",
    read: true,
    icon: "user",
    iconColor: Colors.gray500,
    iconBg: Colors.gray100,
  },
];

const NotificationsScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(notificationsData);
  const [isClearing, setIsClearing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const clearButtonScale = useRef(new Animated.Value(1)).current;
  const itemAnims = useRef(
    notifications.map(() => new Animated.Value(1)),
  ).current;

  const [quicksandLoaded] = useQuicksandFonts({
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered item animations
    itemAnims.forEach((anim, index) => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClearAll = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(clearButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(clearButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsClearing(true);

    // Animate items out
    Animated.stagger(
      30,
      itemAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ),
    ).start(() => {
      setTimeout(() => {
        setNotifications([]);
        setIsClearing(false);
      }, 100);
    });
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleDeleteNotification = (id: number, index: number) => {
    Animated.timing(itemAnims[index], {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    });
  };

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color={Colors.deepNavy} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
        {notifications.length > 0 && (
          <Animated.View style={{ transform: [{ scale: clearButtonScale }] }}>
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={handleClearAll}
              disabled={isClearing}
              activeOpacity={0.7}
            >
              {isClearing ? (
                <ActivityIndicator size="small" color={Colors.orange} />
              ) : (
                <>
                  <Feather name="trash-2" size={16} color={Colors.orange} />
                  <Text style={styles.clearAllText}>Clear All</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Unread Section */}
        {unreadCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New</Text>
            {notifications
              .filter((n) => !n.read)
              .map((notification, index) => (
                <Animated.View
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    {
                      opacity: itemAnims[index],
                      transform: [
                        {
                          translateX: itemAnims[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.notificationContent}
                    onPress={() => handleMarkAsRead(notification.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.unreadIndicator} />
                    <View style={styles.notificationText}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>
                          {notification.title}
                        </Text>
                        <Text style={styles.notificationTime}>
                          {notification.time}
                        </Text>
                      </View>
                      <Text
                        style={styles.notificationMessage}
                        numberOfLines={1}
                      >
                        {notification.message}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
          </View>
        )}

        {/* Read Section */}
        {notifications.filter((n) => n.read).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earlier</Text>
            {notifications
              .filter((n) => n.read)
              .map((notification, idx) => {
                const index = notifications.filter((n) => !n.read).length + idx;
                return (
                  <Animated.View
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      {
                        opacity: itemAnims[index] || new Animated.Value(1),
                        transform: [
                          {
                            translateX: (
                              itemAnims[index] || new Animated.Value(1)
                            ).interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.notificationContent}
                      activeOpacity={0.7}
                    >
                      <View style={styles.readIndicator} />
                      <View style={styles.notificationText}>
                        <View style={styles.notificationHeader}>
                          <Text style={styles.notificationTitleRead}>
                            {notification.title}
                          </Text>
                          <Text style={styles.notificationTime}>
                            {notification.time}
                          </Text>
                        </View>
                        <Text
                          style={styles.notificationMessageRead}
                          numberOfLines={1}
                        >
                          {notification.message}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
          </View>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <Animated.View
            style={[
              styles.emptyState,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.emptyIconContainer}>
              <Feather name="bell-off" size={48} color={Colors.gray400} />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>
              You're all caught up! We'll notify you when there are new deals
              and updates.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text style={styles.exploreButtonText}>Explore Deals</Text>
              <Feather name="arrow-right" size={18} color={Colors.white} />
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#F5F5F8",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
  },
  unreadBadge: {
    backgroundColor: Colors.orange,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  unreadBadgeText: {
    fontFamily: Fonts.body.bold,
    fontSize: 12,
    color: Colors.white,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: `${Colors.orange}15`,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 50,
  },
  clearAllText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.orange,
  },
  scrollContent: {
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: 20,
    marginBottom: 12,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  unreadIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.orange,
    marginTop: 6,
    marginRight: 12,
  },
  readIndicator: {
    width: 6,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Colors.deepNavy,
    flex: 1,
  },
  notificationTitleRead: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
    flex: 1,
  },
  notificationMessage: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
  },
  notificationMessageRead: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray400,
  },
  notificationTime: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: Colors.gray400,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.orange,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 50,
  },
  exploreButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.white,
  },
  bottomPadding: {
    height: 40,
  },
});

export default NotificationsScreen;
