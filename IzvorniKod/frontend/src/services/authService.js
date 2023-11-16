import axiosInstance from "../axiosInstance";

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
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Pogrešni podaci za prijavu!");
        return { success: false, message: "Unauthorized" };
      } else {
        console.error('Error occurred:', error);
      }
    }
    
    return { success: true, message: "You have logged in!" };
  }

  async logout() {
    localStorage.removeItem("user_data");
    return { success: true, message: "You have logged out!" };
  }

  register(username, email, password) {
    return axiosInstance.post("/signup", {
      username,
      email,
      password,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
