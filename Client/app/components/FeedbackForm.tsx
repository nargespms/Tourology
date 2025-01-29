import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type FeedbackFormProps = {
  onSubmit: (rating: number, feedback: string) => void;
  onClose: () => void;
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  return (
    <View style={styles.feedbackWrapper}>
      <View style={styles.feedbackHeader}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Leave feedback</Text>
          <Text style={styles.subtitle}>Share your experience with others</Text>
        </View>
      </View>

      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={28}
              color={star <= rating ? "#000" : "#999"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Write your feedback..."
        placeholderTextColor="#999"
        multiline
        value={feedback}
        onChangeText={setFeedback}
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => onSubmit(rating, feedback)}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackForm;

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: "auto",
    alignItems: "center",
  },
  feedbackWrapper: {
    width: "100%",
  },
  feedbackHeader: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#504e4e",
    padding: 12,
    borderRadius: 6,
    height: 200,
    textAlignVertical: "top",
    marginVertical: 12,
  },
  submitButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
