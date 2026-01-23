import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    useFonts as useManropeFonts,
} from "@expo-google-fonts/manrope";
import {
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
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

type PaymentStatus = "successful" | "failed";

type Transaction = {
  id: string;
  couponPackageName: string;
  purchaseDate: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId: string;
  paymentMethod: string;
};

type DateRange = {
  label: string;
  startDate: Date | null;
  endDate: Date | null;
};

// Mock transaction data with package names
const mockTransactions: Transaction[] = [
  {
    id: "1",
    couponPackageName: "Pro Package",
    purchaseDate: "2026-01-20T14:30:00",
    amount: 2999,
    currency: "LKR",
    status: "successful",
    transactionId: "TXN-2026012001",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "2",
    couponPackageName: "Business Package",
    purchaseDate: "2025-12-15T10:15:00",
    amount: 1499,
    currency: "LKR",
    status: "successful",
    transactionId: "TXN-2025121501",
    paymentMethod: "Mastercard •••• 8888",
  },
  {
    id: "3",
    couponPackageName: "Pro Package",
    purchaseDate: "2025-11-28T09:45:00",
    amount: 2999,
    currency: "LKR",
    status: "failed",
    transactionId: "TXN-2025112801",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "4",
    couponPackageName: "Starter Package",
    purchaseDate: "2025-11-01T16:20:00",
    amount: 499,
    currency: "LKR",
    status: "successful",
    transactionId: "TXN-2025110101",
    paymentMethod: "PayPal",
  },
  {
    id: "5",
    couponPackageName: "Business Package",
    purchaseDate: "2025-10-15T11:30:00",
    amount: 1499,
    currency: "LKR",
    status: "failed",
    transactionId: "TXN-2025101501",
    paymentMethod: "Visa •••• 1234",
  },
  {
    id: "6",
    couponPackageName: "Starter Package",
    purchaseDate: "2025-09-20T08:00:00",
    amount: 499,
    currency: "LKR",
    status: "successful",
    transactionId: "TXN-2025092001",
    paymentMethod: "Mastercard •••• 8888",
  },
  {
    id: "7",
    couponPackageName: "Pro Package",
    purchaseDate: "2025-08-10T15:45:00",
    amount: 2999,
    currency: "LKR",
    status: "successful",
    transactionId: "TXN-2025081001",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "8",
    couponPackageName: "Business Package",
    purchaseDate: "2025-07-05T12:00:00",
    amount: 1499,
    currency: "LKR",
    status: "successful",
    transactionId: "TXN-2025070501",
    paymentMethod: "PayPal",
  },
];

const statusConfig: Record<
  PaymentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: keyof typeof Feather.glyphMap;
  }
> = {
  successful: {
    label: "Successful",
    color: Colors.success,
    bgColor: `${Colors.success}15`,
    icon: "check-circle",
  },
  failed: {
    label: "Failed",
    color: Colors.error,
    bgColor: `${Colors.error}15`,
    icon: "x-circle",
  },
};

const dateRangeOptions: DateRange[] = [
  { label: "All Time", startDate: null, endDate: null },
  {
    label: "Last 7 Days",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  {
    label: "Last 30 Days",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  {
    label: "Last 3 Months",
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  {
    label: "Last 6 Months",
    startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
  {
    label: "Last Year",
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  },
];

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<PaymentStatus | "all">(
    "all",
  );
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(
    dateRangeOptions[0],
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(0)).current;
  const datePickerScale = useRef(new Animated.Value(0.9)).current;
  const datePickerOpacity = useRef(new Animated.Value(0)).current;

  const [quicksandLoaded] = useQuicksandFonts({
    Quicksand_700Bold,
  });

  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (showDatePicker) {
      Animated.parallel([
        Animated.spring(datePickerScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
        }),
        Animated.timing(datePickerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      datePickerScale.setValue(0.9);
      datePickerOpacity.setValue(0);
    }
  }, [showDatePicker]);

  const loadTransactions = () => {
    // Simulate API call
    setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
      animateContent();
    }, 1000);
  };

  const animateContent = () => {
    Animated.sequence([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const filterByDateRange = (transaction: Transaction) => {
    if (!selectedDateRange.startDate || !selectedDateRange.endDate) {
      return true;
    }
    const transactionDate = new Date(transaction.purchaseDate);
    return (
      transactionDate >= selectedDateRange.startDate &&
      transactionDate <= selectedDateRange.endDate
    );
  };

  const filteredTransactions = transactions
    .filter(filterByDateRange)
    .filter((t) =>
      selectedFilter === "all" ? true : t.status === selectedFilter,
    );

  const handleDateRangeSelect = (range: DateRange) => {
    setSelectedDateRange(range);
    setShowDatePicker(false);
  };

  if (!quicksandLoaded || !manropeLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.orange} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.orange} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={22} color={Colors.deepNavy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={styles.headerPlaceholder} />
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.orange}
            colors={[Colors.orange]}
          />
        }
      >
        {/* Filter Chips - Horizontal Scrollable */}
        <Animated.View style={{ opacity: listOpacity }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            <TouchableOpacity
              style={styles.dateRangeButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Feather name="calendar" size={14} color={Colors.gray500} />
              <Text style={styles.dateRangeText}>
                {selectedDateRange.label}
              </Text>
              <Feather name="chevron-down" size={14} color={Colors.gray400} />
            </TouchableOpacity>
            <View style={styles.filterDivider} />
            <FilterTab
              label="All"
              isActive={selectedFilter === "all"}
              onPress={() => setSelectedFilter("all")}
              count={transactions.filter(filterByDateRange).length}
            />
            <FilterTab
              label="Successful"
              isActive={selectedFilter === "successful"}
              onPress={() => setSelectedFilter("successful")}
              count={
                transactions
                  .filter(filterByDateRange)
                  .filter((t) => t.status === "successful").length
              }
            />
            <FilterTab
              label="Failed"
              isActive={selectedFilter === "failed"}
              onPress={() => setSelectedFilter("failed")}
              count={
                transactions
                  .filter(filterByDateRange)
                  .filter((t) => t.status === "failed").length
              }
            />
          </ScrollView>
        </Animated.View>

        {/* Transactions List */}
        <Animated.View
          style={[styles.transactionsList, { opacity: listOpacity }]}
        >
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Feather name="inbox" size={48} color={Colors.gray300} />
              </View>
              <Text style={styles.emptyTitle}>No transactions found</Text>
              <Text style={styles.emptySubtext}>
                {selectedFilter === "all"
                  ? "No payments in this date range"
                  : `No ${selectedFilter} transactions in this date range`}
              </Text>
            </View>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                index={index}
                formatDate={formatDate}
                formatTime={formatTime}
                formatAmount={formatAmount}
              />
            ))
          )}
        </Animated.View>
      </ScrollView>

      {/* Date Range Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="none"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <Animated.View
            style={[
              styles.datePickerModal,
              {
                opacity: datePickerOpacity,
                transform: [{ scale: datePickerScale }],
              },
            ]}
          >
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>Select Date Range</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={22} color={Colors.gray500} />
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerOptions}>
              {dateRangeOptions.map((range, index) => (
                <DateRangeOption
                  key={range.label}
                  range={range}
                  isSelected={selectedDateRange.label === range.label}
                  onSelect={handleDateRangeSelect}
                  index={index}
                />
              ))}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

type DateRangeOptionProps = {
  range: DateRange;
  isSelected: boolean;
  onSelect: (range: DateRange) => void;
  index: number;
};

const DateRangeOption = ({
  range,
  isSelected,
  onSelect,
  index,
}: DateRangeOptionProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.dateOption, isSelected && styles.dateOptionSelected]}
        onPress={() => onSelect(range)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Text
          style={[
            styles.dateOptionText,
            isSelected && styles.dateOptionTextSelected,
          ]}
        >
          {range.label}
        </Text>
        {isSelected && <Feather name="check" size={18} color={Colors.orange} />}
      </TouchableOpacity>
    </Animated.View>
  );
};

type FilterTabProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
  count: number;
};

const FilterTab = ({ label, isActive, onPress, count }: FilterTabProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.filterTab, isActive && styles.filterTabActive]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Text
          style={[styles.filterTabText, isActive && styles.filterTabTextActive]}
        >
          {label}
        </Text>
        {count > 0 && (
          <View
            style={[styles.filterBadge, isActive && styles.filterBadgeActive]}
          >
            <Text
              style={[
                styles.filterBadgeText,
                isActive && styles.filterBadgeTextActive,
              ]}
            >
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

type TransactionCardProps = {
  transaction: Transaction;
  index: number;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
  formatAmount: (amount: number, currency: string) => string;
};

const TransactionCard = ({
  transaction,
  index,
  formatDate,
  formatTime,
  formatAmount,
}: TransactionCardProps) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.spring(expandAnim, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const expandHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const status = statusConfig[transaction.status];

  return (
    <Animated.View
      style={[
        styles.transactionCard,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={toggleExpand}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        <View style={styles.transactionMain}>
          <View style={styles.transactionLeft}>
            <View
              style={[
                styles.transactionIcon,
                { backgroundColor: status.bgColor },
              ]}
            >
              <Feather name={status.icon} size={20} color={status.color} />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.packageName} numberOfLines={1}>
                {transaction.couponPackageName}
              </Text>
              <Text style={styles.transactionDate}>
                {formatDate(transaction.purchaseDate)} •{" "}
                {formatTime(transaction.purchaseDate)}
              </Text>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <Text style={styles.transactionAmount}>
              {formatAmount(transaction.amount, transaction.currency)}
            </Text>
            <View
              style={[styles.statusBadge, { backgroundColor: status.bgColor }]}
            >
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Expanded Details */}
        <Animated.View
          style={[styles.expandedContent, { height: expandHeight }]}
        >
          <View style={styles.expandedDivider} />
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>
                {transaction.transactionId}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>
                {transaction.paymentMethod}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Expand Indicator */}
        <View style={styles.expandIndicator}>
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={Colors.gray400}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray100,
  },
  loadingText: {
    fontFamily: Fonts.body.medium,
    fontSize: 14,
    color: Colors.gray500,
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  headerTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  dateRangeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  dateRangeText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray600,
  },
  filterDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.gray200,
    marginHorizontal: 4,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  filterTabActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  filterTabText: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.gray600,
  },
  filterTabTextActive: {
    color: Colors.white,
  },
  filterBadge: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  filterBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  filterBadgeText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 11,
    color: Colors.gray600,
  },
  filterBadgeTextActive: {
    color: Colors.white,
  },
  transactionsList: {
    gap: 12,
    paddingHorizontal: 20,
  },
  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  packageName: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 15,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  transactionDate: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: Colors.gray500,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontFamily: Fonts.body.bold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 11,
  },
  expandedContent: {
    overflow: "hidden",
  },
  expandedDivider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginTop: 16,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: Colors.gray400,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: Fonts.body.medium,
    fontSize: 13,
    color: Colors.deepNavy,
  },
  expandIndicator: {
    alignItems: "center",
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 16,
    color: Colors.deepNavy,
    marginBottom: 4,
  },
  emptySubtext: {
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  datePickerModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 40,
    maxHeight: "60%",
  },
  datePickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  datePickerTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 18,
    color: Colors.deepNavy,
  },
  datePickerOptions: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  dateOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  dateOptionSelected: {
    backgroundColor: `${Colors.orange}10`,
  },
  dateOptionText: {
    fontFamily: Fonts.body.medium,
    fontSize: 15,
    color: Colors.deepNavy,
  },
  dateOptionTextSelected: {
    fontFamily: Fonts.body.semiBold,
    color: Colors.orange,
  },
});
