import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

class AuthService {
  async login(email, password) {
    try {
      const res1 = await axiosInstance.post("/login", {
        email,
        password,
      });
      const user_id = res1.data.data.user.user_id;
      let user_role = res1.data.data.user.role;
      if(user_role === "doctor"){
        user_role = "employee";
      }
        
      localStorage.setItem("user_role", JSON.stringify(user_role));
      localStorage.setItem("user_id", JSON.stringify(user_id));
      toast.success("Uspješno ste se prijavili!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.warning("Pogrešni podaci za prijavu!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return { success: false, message: "Unauthorized" };
      } else if(error.response && error.response.status === 400){
        toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return { success: false, message: "Error" };
      }
      else{
        toast.error("Dogodila se greška!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return { success: false, message: "Error" };
      }
    }

    return { success: true, message: "You have logged in!" };
  }

  async logout() {
    try {
      await axiosInstance.post("/logout");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      toast.info("Odjavljeni ste.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.info("Došlo je do greške prilikom odjavljivanja.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return { success: false, message: "Error" };
    }

    return { success: true, message: "You have logged out!" };
  }

  async register(reg_data) {
    try {
      await axiosInstance.post("/patients", reg_data);
      toast.info("Potvrdite e-mail adresu!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.warning("Uneseni podaci nisu valjani!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return { success: false, message: "Bad request" };
      } else {
        toast.error("Dogodila se greška!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return { success: false, message: "Error" };
      }
    }

    return { success: true, message: "You have registered successfully!" };
  }

}

export default new AuthService();
