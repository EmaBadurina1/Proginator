import axiosInstance from "../axiosInstance";

class EmployeeService {
  async patientPreview() {
    try {
      const res = await axiosInstance.get("/patients");
      localStorage.setItem("patient_data", JSON.stringify(res.data));
    } catch (error) {
      return { success: false, message: "Error" };
    }
    return {success: true, message: "Success!"};
  }

  async appointmentsPreview() {
    try {
      const res2 = await axiosInstance.get("/appointments");
      localStorage.setItem("appointment_data", JSON.stringify(res2.data));
    } catch (error) {
      return { success: false, message: "Error" };
    }
    return {success: true, message: "Success!"};
  }

  async getPatientById(patientId) {
    try {
      const res3 = await axiosInstance.get("/patients/" + patientId);
      localStorage.setItem("patient", JSON.stringify(res3.data));
    } catch (error) {
      return { success: false, message: "Error" };
    }
    return {success: true, message: "Success!"};
  }

  async getAppointmentById(appointmentId) {
    try {
      const res4 = await axiosInstance.get("/appointments/" + appointmentId);
      localStorage.setItem("appointment", JSON.stringify(res4.data));
    } catch (error) {
      return { success: false, message: "Error" };
    }
    return {success: true, message: "Success!"};
  }

  async getAppointmentsByPatient(patientId) {
    try {
      const res5 = await axiosInstance.get("/appointments/by-patient/" + patientId);
      localStorage.setItem("appointment_data_by_patient", JSON.stringify(res5.data));
    } catch (error) {
      return { success: false, message: "Error" };
    }
    return {success: true, message: "Success!"};
  }

  async updateAppointment(appointmentId, updatedData) {
    try {
      const res = await axiosInstance.patch(`/appointments/${appointmentId}`, updatedData);
      localStorage.setItem("appointment", JSON.stringify(res.data));
      return { 
        success: true, 
        message: "Success!",
      };
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }

  getCurrentPatientData() {
    return JSON.parse(localStorage.getItem("patient_data"));
  }

  getCurrentAppointmentData() {
    return JSON.parse(localStorage.getItem("appointment_data"));
  }

  getCurrentPatient() {
    return JSON.parse(localStorage.getItem("patient"));
  }

  getCurrentAppointment() {
    return JSON.parse(localStorage.getItem("appointment"));
  }

  getCurrentAppointmentDataByPatient() {
    return JSON.parse(localStorage.getItem("appointment_data_by_patient"));
  }
}

export default new EmployeeService();
