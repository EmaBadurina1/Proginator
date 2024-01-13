import axiosInstance from "../axiosInstance";
import { toast } from "react-toastify";

class RoomService {

   async deleteRoom(roomNum){
      try {
         const response = await axiosInstance.delete(`/rooms/${roomNum}`);
         toast.success("Uspješno ste izbrisali sobu!", {
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
export default new RoomService();