import axios from "axios";
import BindingClass from "../util/bindingClass";
import Authenticator from "./authenticator";


 /**
 * Client to call the HealthManagementServices.
 *
 */
export default class healthManagementClient extends BindingClass {

    constructor(props = {}) {
        super();

        const methodsToBind = ['clientLoaded', 'getIdentity', 'login', 'logout', 'getAppointment', 'createAppointment',
        'cancelAppointment', 'rescheduleAppointments', 'viewAllAppointments', 'searchAppointments']
        this.bindClassMethods(methodsToBind, this);

        this.authenticator = new Authenticator();;
        this.props = props;

        axios.defaults.baseURL = process.env.API_BASE_URL;
        this.axiosClient = axios;
        this.ClientLoaded();
    }

    /**
     * Run any functions that are supposed to be called once the client has loaded successfully.
     */
     clientLoaded() {
        if(this.props.hasOwnProperty("onReady")) {
            this.props.onReady(this);
        }
     }
     /**
      * Get the identity of the current user
      * @param errorCallback (Optional) A function to execute if the call fails.
      * @returns The user information for the current user.
      */
    async getIdentity(errorCallback) {
        try{
            const isLoggedIn = await this.authenticator.isUserLoggedIn();

            if(!isLoggedIn) {
                return undefined
            }

            return await this.authenticator.getCurrentUserInfo();
        } catch (error) {
            this.handleError(error, errorCallback)
        }
    }

    
    async login() {
        this.authenticator.login();
    }

    async logout() {
        this.authenticator.logout();
    }

    async getTokenOrThrow(unauthenticatedErrorMessage) {
        const isLoggedIn = await this.authenticator.isUserLoggedIn();
        if (!isLoggedIn) {
            throw new Error(unauthenticatedErrorMessage);
        }

        return await this.authenticator.getUserToken();
    }

    /**
    * Gets the appointment for the given ID.
    * @param id Unique identifier for a appointment
    * @param errorCallback (Optional) A function to execute if the call fails.
    * @returns The appointment's metadata.
    */
    async getAppointment(id, errorCallback) {
        try {
            const token = await this.getTokenOrThrow("Only authenticated users can view appointments.")
            const response = await this.axiosClient.get(`appointment/${id}` ,
            {
             headers: {
                Authorization: `Bearer ${token}`
             }
             });
            return response.data.appointment;
        } catch (error) {
            this.handleError(error, errorCallback)
        }
    }

    /**
    * Create a new appointment owned by the current user.
    * @param doctorName
    * @param phoneNumber
    * @param appointmentTime
    * @param location
    * @param appointmentType
    * @param errorCallback A function to execute if the call fails.
    * @returns The appointment that has been created.
    */
    async createAppointment(doctorName, phoneNumber, appointmentTime, location, appointmentType, errorCallback) {
        try {
            const token = await this.getTokenOrThrow("Only authenticated users can create an appointment.");
            const response = await this.axiosClient.post('appointment', {
                doctorName: doctorName,
                phoneNumber: PhoneNumber,
                appointmentTime: appointmentTime,
                location: location,
                appointmentType: appointmentType
            }, {
                headers: {
                    Authorization: 'Bearer ${token}'
                }
            });
            return response.data.appointment;
        } catch (error) {
            this.handleError(error, errorCallback)
        }
    }

    /**
    * Cancel an existing appointment owned by current user.
    * @param id
    */
    async cancelAppointment(id, errorCallback) {
        try {
            const token = await this.getTokenOrThrow("Only authenticated users can cancel an appointment.")
            const response = await this.axiosClient.delete(`appointment/${id}` , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.appointment;
        } catch (error) {
                this.handleError(error, errorCallback)
        }
    }

    /**
    * Reschedule an appointment owned by the user.
    * @param id
    * @param appointmentTime
    * @returns updated appointment
    */
    async rescheduleAppointments(id, appointmentTime, errorCallback) {
        try {
            const token = await this.getTokenOrThrow("Only authenticated users can reschedule appointments.")
            const response = await this.axiosClient.put(`appointment/${id}`, {
                id: id,
                appointmentTime: appointmentTime
            }, {
                headers: {
                   Authorization: `Bearer ${token}`
                }
            });
            return response.data.appointment;
        } catch (error) {
            this.handleError(error, errorCallback)
        }
    }

    /**
    * View all appointments owned by a user.
    * @param patientId
    * @returns all appointments.
    */
    async viewAllAppointments(patientId, errorCallback) {
        try {
            const token = await this.getTokenOrThrow("Only authenticated users can view appointments.")
            const response = await this.axiosClient.get(`appointment/${patientId}`,
            {
             headers: {
                Authorization: `Bearer ${token}`
             }
             });
             return response.data.appointment;
         } catch (error) {
             this.handleError(error, errorCallback)
        }
   }

   /**
   * Search for an appointment.
   * @param patientId the id of the user to search an appointment to
   * @param id the id of the appointment to search an appointment to
   * @param doctorName the doctor of the appointment to search an appointment to
   * @param status the status of the appointment to search an appointment to
   * @returns The appointments that match the search criteria.
   */
   async searchAppointments(patientId, id, doctorName, status, errorCallback) {
       try {
           const token = await this.getTokenOrThrow("Only authenticated users can search appointments.")
           const response = await this.axiosClient.get(`appointment/search/${patientId}`, {
           }, {
           headers: {
              Authorization: `Bearer ${token}`
           }
           });
           return response.data.appointment;
           } catch (error) {
                this.handleError(error, errorCallback)
           }
      }

   /**
   * Helper method to log the error and run any error functions.
   * @param error The error received from the server.
   * @param errorCallback (Optional) A function to execute if the call fails.
   */
   handleError(error, errorCallback) {
        console.error(error);

        const errorFromApi = error?.response?.data?.error_message;
        if (errorFromApi) {
            console.error(errorFromApi)
            error.message = errorFromApi;
        }

        if (errorCallback) {
            errorCallback(error);
        }
   }
}
