import { registerHandler } from "../api/auth";
import { useLoggedUser } from "../contexts/loggedUserData";
import { useRegistration } from "../contexts/RegistrationContext";
import { useMutation } from "@tanstack/react-query";

export default function useSubmitRegister(onSuccess: (data: any) => void) {
  const { data } = useRegistration();
  const { updateData } = useLoggedUser();

  const { mutate, error, isPending } = useMutation({
    mutationFn: () => registerHandler(data),
    onError: (error) => {
      console.log(error);
    },
    onSuccess(response) {
      updateData({
        id: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
        email: response.email,
        token: response.token,
      });
      onSuccess(response);
    },
  });

  return {
    mutate,
    error,
    isPending,
  };
}
