import { registerHandler } from "../api/auth";
import { useRegistration } from "../contexts/RegistrationContext";
import { useMutation } from "@tanstack/react-query";

export default function useSubmitRegister(onSuccess: (data: any) => void) {
  const { data } = useRegistration();

  console.log("data", data);

  const { mutate, error, isPending } = useMutation({
    mutationFn: () => registerHandler(data),
    onError: (error) => {
      console.log(error);
    },
    onSuccess,
  });

  return {
    mutate,
    error,
    isPending,
  };
}
