import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

class DeviceService {

   async deleteDevice(deviceId){
      try {
         const response = await axiosInstance.delete(`/devices/${deviceId}`);
         toast.success("Uspješno ste izbrisali uređaj!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
         return response.data;
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }

   async getDeviceById(deviceId){
      try {
         const response = await axiosInstance.get(`/devices/${deviceId}`);
         return response.data.data.device;
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }

   async updateDevice(deviceId, data){
      try {
         const response = await axiosInstance.patch(`/devices/${deviceId}`, data);
         toast.success("Uspješno ste promijenili podatke!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return {success:true, data:response.data.data.device}
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }

   async addDevice(data){
      try {
         const response = await axiosInstance.post(`/devices`, data);
         toast.success("Uspješno ste dodali uređaj!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return {success:true, data:response.data.data.device}
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }
}
export default new DeviceService();