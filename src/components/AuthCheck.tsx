import { useEffect } from "react";
import { useStore } from "../store";
import { userService } from "../services/user.service";

const AuthCheck = () => {
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await userService.getCurrentUser();
      if (userData && userData.success) {
        setCurrentUser(userData.user);
      }
    };

    checkAuth();
  }, [setCurrentUser]);

  return null;
};

export default AuthCheck;
