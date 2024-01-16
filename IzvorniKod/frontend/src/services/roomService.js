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

   async getRoomById(roomNum){
      try {
         const response = await axiosInstance.get(`/rooms/${roomNum}`);
         return response.data.data.room;
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }

   async updateRoom(roomNum, data){
      try {
         const response = await axiosInstance.patch(`/rooms/${roomNum}`, data);
         toast.success("Uspješno ste promijenili podatke!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return {success:true, data:response.data.data.room}
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }

   async addRoom(data){
      try {
         const response = await axiosInstance.post(`/rooms`, data);
         toast.success("Uspješno ste dodali prostoriju!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return {success:true, data:response.data.data.room}
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }

   async getAllRooms(){
      try {
         const response = await axiosInstance.get(`/rooms`);
         return response.data.data.rooms;
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }

   async getAllTherapyTypes(){
      try {
         const response = await axiosInstance.get(`/therapy-types`);
         return response.data.data.therapy_types;
      } catch (error) {
         toast.error("Dogodila se greška! " + (error.response.data.error !== undefined ? error.response.data.error : ""), {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
      }
   }
}
export default new RoomService();