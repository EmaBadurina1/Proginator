import axiosInstance from "../axiosInstance";

class EmployeeService {
  async patientPreview() {
    try {
      const res = await axiosInstance.get("/patients");
      localStorage.setItem("patient_data", JSON.stringify(res.data));
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }
  getCurrentPatientData() {
    return JSON.parse(localStorage.getItem("patient_data"));
  }
}

export default new EmployeeService();
