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
}
export default new DeviceService();