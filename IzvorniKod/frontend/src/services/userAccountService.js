import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

class UserAccountService {

   async updateEmployeeProfile(userId, data) {
      try {
         const response = await axiosInstance.patch(`/employees/${userId}`, data);
         toast.success("Uspješno ste promijenili podatke!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
         return {success:true, user_data:response.data.data.employee};
      } catch (error) {
         toast.error("Dogodila se greška! " + error.response.error, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return {success:false};
      }
   }

   async updatePatientProfile(userId, data) {
      try {
         const response = await axiosInstance.patch(`/patients/${userId}`, data);
         toast.success("Uspješno ste promijenili podatke!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return {success:true, user_data:response.data.data.patient};
      } catch (error) {
         toast.error("Dogodila se greška! " + error.response.error, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return {success:false};
      }
   }

   async updateUserPassword(userId, oldPassword, newPassword, newPasswordRep) {
      try {
         const data = {
            old_password: oldPassword,
            new_password: newPassword,
            new_password_rep: newPasswordRep
         };
         const response = await axiosInstance.patch(`/users/${userId}/password`, data);
         toast.success("Uspješno ste promijenili lozinku!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
         return response.data;
      } catch (error) {
         toast.error("Dogodila se greška! " + error.response.error, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }

   async getEmployeeById(userId){
      try {
         const response = await axiosInstance.get(`/employees/${userId}`);
         return response.data.data.employee;
      } catch (error) {
         toast.error("Dogodila se greška! " + error.response.error, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }
}
export default new UserAccountService();