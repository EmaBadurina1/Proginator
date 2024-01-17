import axiosInstance from "../axiosInstance";

class EmployeeService {
  async patientPreview() {
    try {
      const res = await axiosInstance.get("/patients");
      return {
        success: true, 
        message: "Success!",
        data: res.data.data.patients,
      };
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }

  async appointmentsPreview() {
    try {
      const res2 = await axiosInstance.get("/appointments");
      return {
        success: true, 
        message: "Success!",
        data: res2.data.data.appointments
      };
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }

  async getPatientById(patientId) {
    try {
      const res3 = await axiosInstance.get("/patients/" + patientId);
      return {
        success: true, 
        message: "Success!",
        data: res3.data.data.patient,
      };
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }

  async getAppointmentById(appointmentId) {
    try {
      const res4 = await axiosInstance.get("/appointments/" + appointmentId);
      return {
        success: true, 
        message: "Success!",
        data: res4.data.data.appointment,
      };
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }

  async getAppointmentsByPatient(patientId) {
    try {
      const res5 = await axiosInstance.get("/appointments/by-patient/" + patientId);
      return {
        success: true, 
        message: "Success!",
        data: res5.data.data.appointments,
      };
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }

  // OVO JE PROMJENA
  async attendanceAppointment(appointmentId, updatedData) {
        try {
          const res8 = await axiosInstance.patch(`/attendance/${appointmentId}`, updatedData);
          return { 
            success: true, 
            message: "Success!",
            data: res8.data.data.appointment,
          };
        } catch (error) {
          return { success: false, message: "Error" };
        }
      }
  async updateAppointment(appointmentId, updatedData) {
    try {
      const res6 = await axiosInstance.patch(`/appointments/${appointmentId}`, updatedData);
      return { 
        success: true, 
        message: "Success!",
        data: res6.data.data.appointment,
      };
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }
  async getAvailableHours(therapyId, date) {
    try {
      const res7 = await axiosInstance.get(`/free-appointments/therapy/${therapyId}/date/${date}`);
      return { 
        success: true, 
        message: "Success!",
        data: res7.data.data.appointments,
      };
    } catch (error) {
      return { success: false, message: "Error" };
    }
  }
}

export default new EmployeeService();
