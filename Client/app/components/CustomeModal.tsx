import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

type CustomModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  customStyle?: any;
};

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  customStyle,
}) => {
  console.log(CustomModal);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.modalContent, customStyle && customStyle]}
          >
            <ScrollView
              nestedScrollEnabled={true}
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  keyboardAvoid: {
    width: "100%",
  },
});
