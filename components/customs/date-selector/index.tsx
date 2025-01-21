import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";

interface DateSelectorProps {
  onDateSelect: (dateRange: string[] | []) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateSelect }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value: string | null) => {
    setSelectedValue(value);

    let dateRange: { start: string; end: string } | null = null;

    switch (value) {
      case "today":
        dateRange = {
          start: dayjs().startOf("day").toISOString(),
          end: dayjs().endOf("day").toISOString(),
        };
        break;
      case "yesterday":
        dateRange = {
          start: dayjs().subtract(1, "day").startOf("day").toISOString(),
          end: dayjs().subtract(1, "day").endOf("day").toISOString(),
        };
        break;
      case "last3days":
        dateRange = {
          start: dayjs().subtract(3, "day").startOf("day").toISOString(),
          end: dayjs().endOf("day").toISOString(),
        };
        break;
      default:
        dateRange = null;
    }

    const rangeArray = dateRange ? [dateRange.start, dateRange.end] : [];
    onDateSelect(rangeArray);
    setIsOpen(false); // Dropdownni yopish
  };

  return (
    <View className="relative">
      {/* Button */}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className={`flex-row items-center justify-between px-4 py-2 rounded-full border ${
          selectedValue ? "border-primary" : "border-gray-300"
        } bg-white`}
      >
        <Text className={`text-primary ${selectedValue ? "font-bold" : "text-gray-500"}`}>
          {selectedValue
            ? {
                today: "Bugun",
                yesterday: "Kecha",
                last3days: "So'nggi 3 kun",
              }[selectedValue]
            : "Sana"}
        </Text>
        <Text className="text-primary">▼</Text>
      </TouchableOpacity>

      {/* Dropdown */}
      {isOpen && (
        <View className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md">
          <Picker
            selectedValue={selectedValue}
            onValueChange={(value) => handleValueChange(value)}
            dropdownIconColor="#4F46E5"
          >
            <Picker.Item label="Sana" value={null} />
            <Picker.Item label="Bugun" value="today" />
            <Picker.Item label="Kecha" value="yesterday" />
            <Picker.Item label="So'nggi 3 kun" value="last3days" />
          </Picker>
        </View>
      )}
    </View>
  );
};

export default DateSelector;
