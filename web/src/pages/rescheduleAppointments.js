import healthManagementClient from '../api/healthManagementClient';
import Header from '../components/header';
import BindingClass from '../util/bindingClass';
import DataStore from '../util/DataStore';

/**
 * Logic needed for the reschedule appointments page of the website
 */

class RescheduleAppointments extends BindingClass {
    constructor() {
        super();
        this.bindClassMethods(['mount', 'submit', 'redirectToViewAllAppointments', 'search'], this);
        this.dataStore = new DataStore();
        this.dataStore.addChangeListener(this.redirectToViewAllAppointments);
        this.header = new Header(this.dataStore);
    }

     /**
     * Add the header to the page and load the healthManagmentClient.
     */
     mount() {
        document.getElementById('reschedule').addEventListener('click', this.submit);
        document.getElementById('Search Appointments').addEventListener('click', this.search);

        this.header.addHeaderToPage();

        this.client = new healthManagementClient();
    }
     /**
     * Method to run when the reschedule appointment submit button is pressed. Call the MusicPlaylistService to create the
     * playlist.
     */
     async submit(evt) {
        evt.preventDefault();

        const errorMessageDisplay = document.getElementById('error-message');
        errorMessageDisplay.innerText = ``;
        errorMessageDisplay.classList.add('hidden');

        const createButton = document.getElementById('Reschedule');
        const origButtonText = createButton.innerText;
        createButton.innerText = 'Loading...';

        const appointmentName = document.getElementById('appointment-name').value;
        const tagsText = document.getElementById('tags').value;

        let tags;
        if (tagsText.length < 1) {
            tags = null;
        } else {
            tags = tagsText.split(/\s*,\s*/);
        }

        const appointment = await this.client.rescheduleAppointments(appointmentName, tags, (error) => {
            createButton.innerText = origButtonText;
            errorMessageDisplay.innerText = `Error: ${error.message}`;
            errorMessageDisplay.classList.remove('hidden');
        });
        this.dataStore.set('appointments', appointment);
    }

    async search() {

        const id = document.getElementById('appointmentID').innerText;
        console.log(id);
        const appointment = await this.client.getAppointment(id);

        console.log(appointment)


    }

    /**
     * When the appointment is updated in the datastore, redirect to the view appointments page.
     */
    redirectToViewAllAppointments() {
        const appointment = this.dataStore.get('appointment');
        if (appointment != null) {
            window.location.href = `/appointment.html?id=${appointment.id}`;
        }
    }
}

/**
 * Main method to run when the page contents have loaded.
 */
const main = async () => {
    const rescheduleAppointments = new RescheduleAppointments();
    rescheduleAppointments.mount();
};

window.addEventListener('DOMContentLoaded', main);

