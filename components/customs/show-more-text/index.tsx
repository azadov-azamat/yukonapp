import { Colors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, LayoutChangeEvent, ScrollView } from "react-native";

const MAX_HEIGHT = 100;

const ShowMoreText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);
  const textRef = useRef<Text>(null);

  const MAX_LINES = 3; // Maximum lines to show before truncating

  useEffect(() => {
    if (!isExpanded && maxHeight !== null) {
      checkTruncation();
    }
  }, [isExpanded, maxHeight, text]);

  const toggleTextVisibility = () => {
    setIsExpanded(!isExpanded);
  };

  const checkTruncation = () => {
    if (textRef.current) {
      textRef.current.measure((_, __, ___, height) => {        
        if (height > maxHeight!) {
          setIsTruncated(true);
        } else {
          setIsTruncated(false);
        }
      });
    }
  };

  const onLayoutText = (event: LayoutChangeEvent) => {
    if (!isExpanded) {
      setMaxHeight(event.nativeEvent.layout.height);
    }
  };

  return (
    <View className={`relative w-full overflow-hidden`}>
      {/* Text Content */}
      <ScrollView
        className={`overflow-hidden ${isExpanded ? 'max-h-screen' : `max-h-[${MAX_HEIGHT}px]`}`}
        scrollEnabled={!isExpanded}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <Text
            ref={textRef}
            className={`text-sm text-gray-800`}
            numberOfLines={!isExpanded ? MAX_LINES : undefined}
            onLayout={!isExpanded ? onLayoutText : undefined}
        >
        {text}
        </Text>
      </ScrollView>

      {/* Expand/Collapse Button */}
      {!isTruncated && (
        <TouchableOpacity
          onPress={toggleTextVisibility}
          className={`absolute top-0 right-0 flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full`}
        >
            <Ionicons name={isExpanded ? 'chevron-collapse' : 'chevron-expand'} size={17} color={Colors.light.tint}/>
        </TouchableOpacity>
      )} 
    </View>
  );
};

export default ShowMoreText;
