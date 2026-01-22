import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Colors } from "../constants/theme";

const SplashScreen = () => {
  const router = useRouter();
  const scaleAnim = new Animated.Value(0.5);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to welcome after 2 seconds
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.qponLogo}>
          {/* Q shape - gradient circle */}
          <View style={styles.qCircle} />
          {/* P shape - rectangle */}
          <View style={styles.pRectangle} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.deepNavy,
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  qponLogo: {
    width: 120,
    height: 120,
    position: "relative",
  },
  qCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.orange,
    position: "absolute",
    left: 10,
    top: 10,
    shadowColor: Colors.teal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  pRectangle: {
    width: 60,
    height: 100,
    backgroundColor: Colors.purple,
    position: "absolute",
    right: 0,
    top: 10,
    borderRadius: 12,
    shadowColor: Colors.teal,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
});

export default SplashScreen;
