import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function StyledButton({ text }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isHovered && styles.buttonHover,
        isFocused && styles.buttonFocus,
      ]}
      onPressIn={() => setIsFocused(true)} // Simulate focus state
      onPressOut={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)} // Simulate hover state (only works on platforms that support mouse)
      onMouseLeave={() => setIsHovered(false)}
    >
      <Text style={{ color: styles.button.color }}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexShrink: 0, // Equivalent to "flex-none" in Tailwind
    borderRadius: 8, // Rounded corners; 8px matches "rounded-md"
    backgroundColor: "#6366F1", // Indigo-500
    paddingHorizontal: 14, // px-3.5 (14px padding left and right)
    paddingVertical: 10, // py-2.5 (10px padding top and bottom)
    fontSize: 14, // text-sm
    fontWeight: "600", // font-semibold
    color: "#FFFFFF", // White text
    shadowColor: "#000", // Shadow settings for React Native
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4, // Matches "shadow-sm"
    elevation: 4, // Adds shadow for Android
  },
  buttonHover: {
    backgroundColor: "#818CF8", // Hover color for Indigo-400 (simulate hover)
  },
  buttonFocus: {
    borderWidth: 2, // Simulates "focus-visible:outline-2"
    borderColor: "#6366F1", // Focus border for Indigo-500
    outlineOffset: 2, // Simulate "focus-visible:outline-offset-2"
  },
});
