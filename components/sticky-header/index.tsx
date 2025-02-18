import React, { useRef, ReactNode } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

interface StickyHeaderProps {
  title?: string;
  children: ReactNode; // Allow custom content inside
}

const HEADER_HEIGHT = 80;
const SCROLL_THRESHOLD = 100; // Pixels before color transition

const StickyHeader: React.FC<StickyHeaderProps> = ({ title = "Sticky Header", children }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Interpolate background color based on scroll position
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: ["#ffffff", "#007AFF"], // Adjust to your colors
    extrapolate: "clamp",
  });

  // Scroll event handler
  const handleScroll = Animated.event<NativeSyntheticEvent<NativeScrollEvent>>(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.container}>
      {/* Animated Sticky Header */}
      <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
        <Text style={styles.headerText}>{title}</Text>
      </Animated.View>

      {/* Scrollable Content (Passed from Parent) */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Smooth animation updates
      >
        {children}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  scrollContent: {
    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: 50,
  },
});

export default StickyHeader;
