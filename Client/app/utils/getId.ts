import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export default function getId() {
  return uuidv4();
}
