import { createStackNavigator } from "@react-navigation/stack";
import RegisterChooseRole from "../components/RegisterChooseRole";
import RegisterStepOne from "../components/RegisterStepOne";
import TourGuideSkillSet from "../components/TourGuideSkillSet";
import TourGuideCompleteProfile from "../components/TourGuideCompleteProfile";
import { RegistrationProvider } from "../contexts/RegistrationContext";

const Stack = createStackNavigator();

const RegistrationProcess = () => {
  return (
    <RegistrationProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="RegistrationStepOne"
          component={RegisterStepOne}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="RegisterChooseRole"
          component={RegisterChooseRole}
        />
        <Stack.Screen
          name="TourGuideSkillSet"
          component={TourGuideSkillSet}
          options={{ headerShown: false, gestureEnabled: true }}
        />
        <Stack.Screen
          name="TourGuideCompleteProfile"
          component={TourGuideCompleteProfile}
          options={{ headerShown: false, gestureEnabled: true }}
        />
      </Stack.Navigator>
    </RegistrationProvider>
  );
};

export default RegistrationProcess;
