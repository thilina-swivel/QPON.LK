import { Colors, Fonts } from "@/constants/theme";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Linking,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COVER_HEIGHT = 200;
const LOGO_SIZE = 64;

// Mock merchant data
const getMerchantById = (id: string) => ({
  id: parseInt(id) || 1,
  name: "Urban Bites Kitchen",
  logo: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200",
  categories: ["Dining", "Cafe", "Bar"],
  coverImages: [
    "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800",
  ],
  about:
    "Urban Bites Kitchen is a modern culinary destination offering a fusion of international flavors with locally sourced ingredients. Our passionate chefs craft each dish with precision and creativity, ensuring an unforgettable dining experience. Whether you're looking for a casual lunch or a memorable dinner, we have something special for every occasion.",
  location: {
    address: "42 Galle Face Court, Colombo 03",
    city: "Colombo",
    mapUrl: "https://maps.google.com/?q=Urban+Bites+Kitchen",
  },
  contactNumber: "+94 11 234 5678",
  website: "https://www.urbanbiteskitchen.lk",
  openingHours: [
    { day: "Monday - Friday", hours: "11:00 AM - 11:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 12:00 AM" },
    { day: "Sunday", hours: "10:00 AM - 10:00 PM" },
  ],
  socialMedia: {
    instagram: "urbanbiteskitchen",
    facebook: "urbanbiteskitchen",
    tiktok: "urbanbiteskitchen",
    youtube: "urbanbiteskitchen",
    twitter: "urbanbiteskitchen",
  },
  branches: [
    {
      id: 1,
      name: "Colombo 03 - Main Branch",
      address: "42 Galle Face Court, Colombo 03",
      phone: "+94 11 234 5678",
      isMain: true,
    },
    {
      id: 2,
      name: "Colombo 07 - Cinnamon Gardens",
      address: "15 Park Street, Colombo 07",
      phone: "+94 11 345 6789",
      isMain: false,
    },
    {
      id: 3,
      name: "Negombo",
      address: "78 Beach Road, Negombo",
      phone: "+94 31 456 7890",
      isMain: false,
    },
  ],
  menu: {
    hasMenu: true,
    menuImage:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  deals: [
    {
      id: 1,
      title: "Gourmet Burger Combo",
      description: "Premium burger with fries and drink",
      originalPrice: 2500,
      discountedPrice: 1875,
      discountPercent: 25,
      image:
        "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400",
      couponsLeft: 45,
      expiresIn: "3 days",
    },
    {
      id: 2,
      title: "Seafood Platter for 2",
      description: "Fresh seafood with sides",
      originalPrice: 5500,
      discountedPrice: 3850,
      discountPercent: 30,
      image:
        "https://images.pexels.com/photos/1310777/pexels-photo-1310777.jpeg?auto=compress&cs=tinysrgb&w=400",
      couponsLeft: 23,
      expiresIn: "5 days",
    },
    {
      id: 3,
      title: "Weekend Brunch Special",
      description: "All-you-can-eat brunch buffet",
      originalPrice: 3200,
      discountedPrice: 2240,
      discountPercent: 30,
      image:
        "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400",
      couponsLeft: 67,
      expiresIn: "7 days",
    },
  ],
});

export default function MerchantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const merchant = getMerchantById(id || "1");

  // Tab state
  const [activeTab, setActiveTab] = useState<"deals" | "info">("deals");
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  // Carousel state
  const [activeCoverIndex, setActiveCoverIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Menu modal state
  const [showMenuModal, setShowMenuModal] = useState(false);
  const menuModalAnim = useRef(new Animated.Value(0)).current;

  // Request Deal modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestCategory, setRequestCategory] = useState<string | null>(null);
  const [requestPromoType, setRequestPromoType] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const requestModalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-scroll carousel
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const startAutoScroll = () => {
    autoScrollTimer.current = setInterval(() => {
      const nextIndex = (activeCoverIndex + 1) % merchant.coverImages.length;
      carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setActiveCoverIndex(nextIndex);
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
  };

  const handleCarouselScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeCoverIndex) {
      setActiveCoverIndex(index);
      stopAutoScroll();
      startAutoScroll();
    }
  };

  const switchTab = (tab: "deals" | "info") => {
    setActiveTab(tab);
    Animated.spring(tabIndicatorAnim, {
      toValue: tab === "deals" ? 0 : 1,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const openSocialMedia = (platform: string, handle: string) => {
    const urls: Record<string, string> = {
      instagram: `https://instagram.com/${handle}`,
      facebook: `https://facebook.com/${handle}`,
      tiktok: `https://tiktok.com/@${handle}`,
      youtube: `https://youtube.com/@${handle}`,
      twitter: `https://twitter.com/${handle}`,
    };
    Linking.openURL(urls[platform]);
  };

  const openPhoneDialer = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const openWebsite = (url: string) => {
    Linking.openURL(url);
  };

  const openMap = (url: string) => {
    Linking.openURL(url);
  };

  const showMenu = () => {
    setShowMenuModal(true);
    Animated.timing(menuModalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideMenu = () => {
    Animated.timing(menuModalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowMenuModal(false));
  };

  const openRequestModal = () => {
    setShowRequestModal(true);
    setShowSuccessMessage(false);
    setRequestCategory(null);
    setRequestPromoType(null);
    setRequestNote("");
    Animated.timing(requestModalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeRequestModal = () => {
    Animated.timing(requestModalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowRequestModal(false);
      setShowSuccessMessage(false);
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: merchant.name,
        message: `Check out ${merchant.name} on QPON! Great deals await you at ${merchant.location.address}. Download QPON app to discover more!`,
        url: merchant.website,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleSubmitRequest = () => {
    // Simulate API call
    setShowSuccessMessage(true);
    // Reset form after showing success
    setTimeout(() => {
      setRequestCategory(null);
      setRequestPromoType(null);
      setRequestNote("");
    }, 500);
  };

  const categories = ["Cafe", "Bar", "Dining"];
  const promoTypes = [
    "Percentage Off",
    "Buy 1 Get 1",
    "Fixed Price",
    "Free Item",
    "Combo Deal",
  ];

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const renderCoverImage = ({ item }: { item: string }) => (
    <View style={styles.coverImageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.6)"]}
        style={styles.coverOverlay}
      />
    </View>
  );

  const renderDealCard = (item: (typeof merchant.deals)[0], index: number) => {
    return (
      <Animated.View
        key={item.id}
        style={[
          styles.dealCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push(`/deal/${item.id}`)}
          style={styles.dealCardTouchable}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.dealImage}
            resizeMode="cover"
          />
          <View style={styles.dealDiscountBadge}>
            <Text style={styles.dealDiscountText}>
              {item.discountPercent}% OFF
            </Text>
          </View>
          <View style={styles.dealInfo}>
            <Text style={styles.dealTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.dealDescription} numberOfLines={1}>
              {item.description}
            </Text>
            <View style={styles.dealPriceRow}>
              <Text style={styles.dealPrice}>
                LKR {formatPrice(item.discountedPrice)}
              </Text>
              <Text style={styles.dealOriginalPrice}>
                LKR {formatPrice(item.originalPrice)}
              </Text>
            </View>
            <View style={styles.dealMetaRow}>
              <View style={styles.dealMetaItem}>
                <Feather name="tag" size={12} color={Colors.gray500} />
                <Text style={styles.dealMetaText}>{item.couponsLeft} left</Text>
              </View>
              <View style={styles.dealMetaItem}>
                <Feather name="clock" size={12} color={Colors.orange} />
                <Text style={[styles.dealMetaText, { color: Colors.orange }]}>
                  {item.expiresIn}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const socialIconMap: Record<string, { name: string; library: string }> = {
    instagram: { name: "instagram", library: "feather" },
    facebook: { name: "facebook", library: "feather" },
    tiktok: { name: "tiktok", library: "fontawesome5" },
    youtube: { name: "youtube", library: "feather" },
    twitter: { name: "twitter", library: "feather" },
  };

  const renderSocialIcon = (platform: string, handle: string) => {
    const icon = socialIconMap[platform];
    return (
      <TouchableOpacity
        key={platform}
        style={styles.socialButton}
        onPress={() => openSocialMedia(platform, handle)}
        activeOpacity={0.7}
      >
        {icon.library === "fontawesome5" ? (
          <FontAwesome5 name={icon.name} size={20} color={Colors.deepNavy} />
        ) : (
          <Feather name={icon.name as any} size={20} color={Colors.deepNavy} />
        )}
      </TouchableOpacity>
    );
  };

  const renderInfoContent = () => (
    <Animated.View
      style={[
        styles.infoContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Main Info Card */}
      <View style={styles.infoCard}>
        {/* About */}
        <Text style={styles.infoLabel}>About</Text>
        <Text style={styles.aboutText}>{merchant.about}</Text>

        <View style={styles.infoDivider} />

        {/* Quick Actions Row */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => openPhoneDialer(merchant.contactNumber)}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Feather name="phone" size={16} color={Colors.orange} />
            </View>
            <Text style={styles.quickActionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => openMap(merchant.location.mapUrl)}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Feather name="navigation" size={16} color={Colors.orange} />
            </View>
            <Text style={styles.quickActionText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => openWebsite(merchant.website)}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Feather name="globe" size={16} color={Colors.orange} />
            </View>
            <Text style={styles.quickActionText}>Website</Text>
          </TouchableOpacity>
          {merchant.menu.hasMenu && (
            <TouchableOpacity
              style={styles.quickAction}
              onPress={showMenu}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <Feather name="book-open" size={16} color={Colors.orange} />
              </View>
              <Text style={styles.quickActionText}>Menu</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoDivider} />

        {/* Location */}
        <Text style={styles.infoLabel}>Location</Text>
        <Text style={styles.infoValue}>{merchant.location.address}</Text>

        <View style={styles.infoDivider} />

        {/* Opening Hours */}
        <Text style={styles.infoLabel}>Hours</Text>
        {merchant.openingHours.map((schedule, index) => (
          <View key={index} style={styles.hoursRow}>
            <Text style={styles.hoursDay}>{schedule.day}</Text>
            <Text style={styles.hoursTime}>{schedule.hours}</Text>
          </View>
        ))}

        <View style={styles.infoDivider} />

        {/* Social Media */}
        <Text style={styles.infoLabel}>Follow Us</Text>
        <View style={styles.socialContainer}>
          {Object.entries(merchant.socialMedia).map(([platform, handle]) =>
            renderSocialIcon(platform, handle),
          )}
        </View>
      </View>

      {/* Branches Card */}
      <View style={styles.infoCard}>
        <View style={styles.branchesHeader}>
          <Text style={styles.infoLabel}>Branches</Text>
          <Text style={styles.branchCount}>
            {merchant.branches.length} locations
          </Text>
        </View>
        {merchant.branches.map((branch, index) => (
          <TouchableOpacity
            key={branch.id}
            style={[
              styles.branchItem,
              index < merchant.branches.length - 1 && styles.branchItemBorder,
            ]}
            activeOpacity={0.7}
            onPress={() => openPhoneDialer(branch.phone)}
          >
            <View style={styles.branchInfo}>
              <View style={styles.branchNameRow}>
                <Text style={styles.branchName}>{branch.name}</Text>
                {branch.isMain && (
                  <View style={styles.mainBadge}>
                    <Text style={styles.mainBadgeText}>Main</Text>
                  </View>
                )}
              </View>
              <Text style={styles.branchAddress}>{branch.address}</Text>
            </View>
            <Feather name="phone" size={16} color={Colors.gray400} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </Animated.View>
  );

  const tabIndicatorTranslate = tabIndicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (SCREEN_WIDTH - 48) / 2],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={Colors.deepNavy} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Merchant Profile</Text>
        </View>
        <TouchableOpacity
          style={styles.headerShareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Feather name="share" size={20} color={Colors.deepNavy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Cover Images Carousel */}
        <View style={styles.coverContainer}>
          <FlatList
            ref={carouselRef}
            data={merchant.coverImages}
            renderItem={renderCoverImage}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleCarouselScroll}
            onScrollBeginDrag={stopAutoScroll}
          />

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {merchant.coverImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeCoverIndex === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          {/* Merchant Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              { transform: [{ scale: logoScale }] },
            ]}
          >
            <Image
              source={{ uri: merchant.logo }}
              style={styles.merchantLogo}
              resizeMode="cover"
            />
          </Animated.View>
        </View>

        {/* Merchant Info Header */}
        <View style={styles.merchantInfoHeader}>
          <View style={styles.merchantTitleRow}>
            <Text style={styles.merchantName}>{merchant.name}</Text>
            <TouchableOpacity
              style={styles.requestDealButton}
              onPress={openRequestModal}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={14} color={Colors.white} />
              <Text style={styles.requestDealText}>Request</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.merchantLocationRow}>
            <Feather name="map-pin" size={12} color={Colors.gray500} />
            <Text style={styles.merchantLocation}>
              {merchant.location.address}
            </Text>
          </View>
          <View style={styles.categoriesRow}>
            {merchant.categories.map((cat, index) => (
              <View key={cat} style={styles.categoryChip}>
                <Text style={styles.categoryChipText}>{cat}</Text>
              </View>
            ))}
          </View>

          {/* Minimal Tab Toggle */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "deals" && styles.tabActive]}
              onPress={() => switchTab("deals")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "deals" && styles.tabTextActive,
                ]}
              >
                Deals
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "info" && styles.tabActive]}
              onPress={() => switchTab("info")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "info" && styles.tabTextActive,
                ]}
              >
                Info
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        {activeTab === "deals" ? (
          <View style={styles.dealsContainer}>
            {merchant.deals.length > 0 ? (
              merchant.deals.map((deal, index) => renderDealCard(deal, index))
            ) : (
              <View style={styles.emptyDeals}>
                <Feather name="tag" size={48} color={Colors.gray300} />
                <Text style={styles.emptyDealsText}>No active deals</Text>
                <Text style={styles.emptyDealsSubtext}>
                  Check back later for new offers
                </Text>
              </View>
            )}
            <View style={{ height: 100 }} />
          </View>
        ) : (
          renderInfoContent()
        )}
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={showMenuModal}
        transparent
        animationType="none"
        onRequestClose={hideMenu}
      >
        <Animated.View
          style={[styles.menuModalOverlay, { opacity: menuModalAnim }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={hideMenu}
          />
          <Animated.View
            style={[
              styles.menuModalContent,
              {
                opacity: menuModalAnim,
                paddingTop: insets.top,
              },
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.menuCloseIcon}
              onPress={hideMenu}
              activeOpacity={0.8}
            >
              <Feather name="x" size={24} color={Colors.white} />
            </TouchableOpacity>

            {/* Menu Image */}
            <ScrollView
              style={styles.menuImageScrollView}
              contentContainerStyle={styles.menuImageContainer}
              showsVerticalScrollIndicator={false}
              maximumZoomScale={3}
              minimumZoomScale={1}
              bouncesZoom={true}
            >
              <Image
                source={{ uri: merchant.menu.menuImage }}
                style={styles.menuImage}
                resizeMode="contain"
              />
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Request Deal Modal */}
      <Modal
        visible={showRequestModal}
        transparent
        animationType="none"
        onRequestClose={closeRequestModal}
      >
        <Animated.View
          style={[styles.requestModalOverlay, { opacity: requestModalAnim }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeRequestModal}
          />
          <Animated.View
            style={[
              styles.requestModalContent,
              {
                transform: [
                  {
                    translateY: requestModalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
                paddingBottom: Math.max(34, insets.bottom + 20),
              },
            ]}
          >
            <View style={styles.requestModalHandle} />

            {showSuccessMessage ? (
              /* Success Message */
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Feather
                    name="check-circle"
                    size={48}
                    color={Colors.orange}
                  />
                </View>
                <Text style={styles.successTitle}>Request Submitted!</Text>
                <Text style={styles.successMessage}>
                  Your deal request has been sent to {merchant.name}. They will
                  review it and get back to you soon.
                </Text>
                <TouchableOpacity
                  style={styles.successButton}
                  onPress={closeRequestModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.successButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Request Form */
              <>
                <Text style={styles.requestModalTitle}>Request a Deal</Text>
                <Text style={styles.requestModalSubtitle}>
                  Tell us what kind of deal you'd like to see
                </Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.requestFormScroll}
                >
                  {/* Category Selection */}
                  <Text style={styles.requestLabel}>Category</Text>
                  <View style={styles.optionsRow}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.optionChip,
                          requestCategory === cat && styles.optionChipActive,
                        ]}
                        onPress={() => setRequestCategory(cat)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            requestCategory === cat &&
                              styles.optionChipTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Promo Type Selection */}
                  <Text style={styles.requestLabel}>Promo Type</Text>
                  <View style={styles.optionsRow}>
                    {promoTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.optionChip,
                          requestPromoType === type && styles.optionChipActive,
                        ]}
                        onPress={() => setRequestPromoType(type)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            requestPromoType === type &&
                              styles.optionChipTextActive,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Note */}
                  <Text style={styles.requestLabel}>Note (Optional)</Text>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="Any additional details..."
                    placeholderTextColor={Colors.gray400}
                    value={requestNote}
                    onChangeText={setRequestNote}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </ScrollView>

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!requestCategory || !requestPromoType) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmitRequest}
                  activeOpacity={0.8}
                  disabled={!requestCategory || !requestPromoType}
                >
                  <LinearGradient
                    colors={
                      requestCategory && requestPromoType
                        ? [Colors.orange, Colors.orangeLight]
                        : [Colors.gray300, Colors.gray300]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitButtonGradient}
                  >
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#F5F5F8",
  },
  headerBackButton: {
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
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  headerShareButton: {
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
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: COVER_HEIGHT + LOGO_SIZE / 2,
    position: "relative",
  },
  coverImageContainer: {
    width: SCREEN_WIDTH,
    height: COVER_HEIGHT,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  pagination: {
    position: "absolute",
    bottom: LOGO_SIZE / 2 + 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  paginationDotActive: {
    backgroundColor: Colors.white,
    width: 20,
  },
  logoContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 14,
    backgroundColor: Colors.white,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  merchantLogo: {
    width: "100%",
    height: "100%",
    borderRadius: 11,
  },
  merchantInfoHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  merchantTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  merchantName: {
    fontFamily: Fonts.heading.bold,
    fontSize: 20,
    color: Colors.deepNavy,
    flex: 1,
  },
  merchantLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  merchantLocation: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: "rgba(255,90,0,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryChipText: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.orange,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.orange,
    marginBottom: -1,
  },
  tabText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray400,
  },
  tabTextActive: {
    fontFamily: Fonts.body.semiBold,
    color: Colors.orange,
  },
  dealsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dealCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  dealCardTouchable: {
    flexDirection: "row",
    padding: 12,
  },
  dealImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  dealDiscountBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: Colors.orange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dealDiscountText: {
    fontFamily: Fonts.body.bold,
    fontSize: 10,
    color: Colors.white,
  },
  dealInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  dealTitle: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  dealDescription: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
    marginTop: 2,
  },
  dealPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 4,
  },
  dealPrice: {
    fontFamily: Fonts.heading.bold,
    fontSize: 16,
    color: Colors.orange,
  },
  dealOriginalPrice: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray400,
    textDecorationLine: "line-through",
  },
  dealMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  dealMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dealMetaText: {
    fontFamily: Fonts.body.medium,
    fontSize: 11,
    color: Colors.gray500,
  },
  emptyDeals: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyDealsText: {
    fontFamily: Fonts.heading.semiBold,
    fontSize: 18,
    color: Colors.gray600,
    marginTop: 16,
  },
  emptyDealsSubtext: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray400,
    marginTop: 4,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
    color: Colors.gray400,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  infoValue: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.deepNavy,
    lineHeight: 20,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginVertical: 16,
  },
  aboutText: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray600,
    lineHeight: 21,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickAction: {
    alignItems: "center",
    gap: 6,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,90,0,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontFamily: Fonts.body.medium,
    fontSize: 12,
    color: Colors.gray600,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  hoursDay: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
  },
  hoursTime: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.deepNavy,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  branchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  branchCount: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray400,
  },
  branchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  branchItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  branchInfo: {
    flex: 1,
  },
  branchNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  branchName: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.deepNavy,
  },
  mainBadge: {
    backgroundColor: "rgba(255,90,0,0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainBadgeText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 9,
    color: Colors.orange,
  },
  branchAddress: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray500,
  },
  menuButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 15,
    color: Colors.white,
  },
  menuModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuModalContent: {
    flex: 1,
    width: "100%",
  },
  menuCloseIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  menuImageScrollView: {
    flex: 1,
  },
  menuImageContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  menuImage: {
    width: SCREEN_WIDTH - 32,
    height: SCREEN_WIDTH * 1.4,
    borderRadius: 12,
  },
  // Request Deal Button & Modal Styles
  requestDealButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.orange,
    borderRadius: 16,
  },
  requestDealText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
    color: Colors.white,
  },
  requestModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  requestModalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: "85%",
  },
  requestModalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gray300,
    alignSelf: "center",
    marginBottom: 20,
  },
  requestModalTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    textAlign: "center",
    marginBottom: 4,
  },
  requestModalSubtitle: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    marginBottom: 24,
  },
  requestFormScroll: {
    maxHeight: 320,
  },
  requestLabel: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
    color: Colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  optionChipActive: {
    backgroundColor: "rgba(255,90,0,0.1)",
    borderColor: Colors.orange,
  },
  optionChipText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray600,
  },
  optionChipTextActive: {
    color: Colors.orange,
    fontFamily: Fonts.body.semiBold,
  },
  noteInput: {
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    padding: 14,
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.deepNavy,
    minHeight: 80,
    marginBottom: 16,
  },
  submitButton: {
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.white,
  },
  // Success Message Styles
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,90,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 22,
    color: Colors.deepNavy,
    marginBottom: 8,
  },
  successMessage: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  successButton: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  successButtonText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.gray600,
  },
});
