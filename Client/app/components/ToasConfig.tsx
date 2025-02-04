import { BaseToast, ErrorToast } from "react-native-toast-message";

// Custom toast styles
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", width: "95%", borderRadius: 10 }}
      contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 8 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 14,
        color: "#666",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "red",
        width: "95%",
        borderRadius: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 14,
        color: "#666",
      }}
    />
  ),
};
export default toastConfig;
