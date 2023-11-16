import axiosInstance from "../axiosInstance";
import { toast } from 'react-toastify';

class AuthService {
  async login(email, password) {
    try {
      const res1 = await axiosInstance.post("/login", {
        email,
        password
      });
      const user_id = res1.data.data.user_id;
      const res2 = await axiosInstance.get("/users/" + user_id, {withCredentials: true});
      localStorage.setItem("user_data", JSON.stringify(res2.data.data));
      toast.success("Uspješno ste se prijavili!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.warning("Pogrešni podaci za prijavu!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return { success: false, message: "Unauthorized" };
      } else {
        toast.error("Dogodila se greška!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return { success: false, message: "Error" };
      }
    }
    
    return { success: true, message: "You have logged in!" };
  }

  async logout() {
    localStorage.removeItem("user_data");
    toast.info("Odjavljeni ste.", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return { success: true, message: "You have logged out!" };
  }

  async register(reg_data) {
    try {
      await axiosInstance.post("/patients", reg_data);
      toast.success("Uspješno ste se registrirali!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning("Uneseni podaci nisu valjani!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return { success: false, message: "Bad request" };
      } else {
        toast.error("Dogodila se greška!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        return { success: false, message: "Error" };
      }
    }
    
    return { success: true, message: "You have registered successfully!" };
  }

  getCurrentUserData() {
    return JSON.parse(localStorage.getItem("user_data"));
  }
}

export default new AuthService();
