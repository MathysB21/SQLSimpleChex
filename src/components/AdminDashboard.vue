<template>
	<div id="app">
		<!-- Add your child components here so Vue knows where to attach them -->
		<div class="checklist">
			<AdminHeaderComponent />
			<SeparatorComponent />
			<AdminMainContainerComponent />
			<SeparatorComponent />
		</div>
        <!-- Tiny popup code -->

        <div id="jobDeletedPopup" class="toast-popup">
            Job deleted successfully!
        </div>

        <div id="jobCreatedPopup" class="toast-popup">
            Job created successfully!
        </div>

        <div id="jobModifiedPopup" class="toast-popup">
            Job modified successfully!
        </div>

        <!-- Delete confirmation popup -->
        <div id="confirmationPopup" class="confirmation-popup">
            <p>Are you sure you want to delete this job?</p>
            <button class="btn" id="confirmDeleteJob">Yes</button>
            <button class="btn" id="cancelDeleteJob">No</button>
        </div>


        <!-- Large input popup code -->

        <div id="createJobPopup" class="popup create-job-popup">
            <span class="close-btn" id="closeCreateJobPopupBtn">&#10006;</span>
            <h2>Create Job</h2>
            <form id="createJobForm">
                <label for="">Job Type:</label>
                <input type="text" id="jobType" required>
                <span class="clear-input">&#10006;</span>

                <label for="">Job Name:</label>
                <input type="text" id="jobName" required>
                <span class="clear-input">&#10006;</span>

                <label for="">Job Time:</label>
                <input type="time" id="jobTime" step="1" required>
                <span class="clear-input">&#10006;</span>

                <label for="">Job Duration: <span class="exampletext">e.g. 20 sec, 2 min or 1h</span> </label>
                <input type="text" id="jobDuration" required>
                <span class="clear-input">&#10006;</span>

                <div class="btndiv">
                    <button class="btn" type="button" id="submitCreateJobFormBtn">Submit</button>
                    <button class="btn" type="button" id="submitCloseCreateJobFormBtn">Submit & Close</button>
                </div>
            </form>
        </div>

        <div id="modifyJobPopup" class="popup modify-job-popup">
            <span class="close-btn" id="closeModifyJobPopupBtn">&#10006;</span>
            <h2>Modify Job</h2>
            <form id="modifyJobForm">
                <!-- Hidden input containing the docid of this job in Firebase -->
                <input style="display:none;" type="text" id="mjobDocID" required>

                <label for="">Job Type:</label>
                <input type="text" id="mjobType" required>
                <span class="clear-input">&#10006;</span>

                <label for="">Job Name:</label>
                <input type="text" id="mjobName" required>
                <span class="clear-input">&#10006;</span>

                <label for="">Job Time:</label>
                <input type="time" id="mjobTime" step="1" required>
                <span class="clear-input">&#10006;</span>

                <label for="">Job Duration: <span class="exampletext">e.g. 20 sec, 2 min or 1h</span> </label>
                <input type="text" id="mjobDuration" required>
                <span class="clear-input">&#10006;</span>

                <div class="btndiv">
                    <button class="btn" type="button" id="saveCloseModifyJobFormBtn">Save & Close</button>
                    <button class="btn" type="button" id="cancelModifyBtn">Cancel</button>
                </div>
            </form>
        </div>

        <!-- Overlay Code -->

        <div class="overlay" id="overlay"></div>
	</div>
</template>


<script>
//Import all the child components to be used in this parent container
import AdminHeaderComponent from './AdminHeaderComponent.vue';
import AdminMainContainerComponent from './AdminMainContainerComponent.vue';
import SeparatorComponent from './SeparatorComponent.vue';

export default {
	name: 'AdminDashboard',
	components: {
		// In here you add all the child components of this component
		AdminHeaderComponent,
		AdminMainContainerComponent,
		SeparatorComponent
	}
}
</script>

<style>
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* Universal Popup Styling */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

.popup {
    display: none;
    position: fixed;
    top: 50px;
    right: 20%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.toast-popup {
    display: none;
    position: fixed;
    top: 50px;
    right: 50px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* Delete Confirmation Popup Styling */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
.confirmation-popup {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    border-radius: 15px;
}

.confirmation-popup button {
    padding: 10px 20px 10px 20px;
    background-color: white;
    border-radius: 5px;
    color: black;
    border: 1px solid black;
    cursor: pointer;
    transition: border-radius 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.6s ease-in-out, padding-left 0.3s ease-in-out, padding-right 0.3s ease-in-out;
}

.confirmation-popup button:hover {
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #919191;
    border-radius: 10px;
    color: white;
    border: 1px solid #919191;
    cursor: pointer;
    box-shadow: 4px 4px 10px #a8a8a8, -4px -4px 10px #ffffff;
}

/* .confirmation-popup button:active, */
.confirmation-popup button:focus {
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #919191;
    border-radius: 10px;
    color: white;
    border: 1px solid #919191;
    cursor: pointer;
    box-shadow: 4px 4px 10px #a8a8a8, -4px -4px 10px #ffffff;
}

.confirmation-popup p {
    margin-bottom: 20px;
    font-weight: bold;
}


/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* Create Job Popup Specific Styling */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

.create-job-popup {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #ccc;
    padding: 20px;
    z-index: 1000;

    border-radius: 28px;
    background: #fff;
}

.create-job-popup label {
    display: block;
    margin-bottom: 5px;
}

.create-job-popup input {
    border: none;
    width: 65%;
    padding: 8px;
    background-color: #e4e4e4;
    margin-bottom: 10px;
    border-radius: 5px;
    /* box-shadow: inset 9px 9px 18px #a8a8a8,
            inset -9px -9px 18px #ffffff; */
    transition: width 0.5s ease-in-out, background-color 0.6s ease-in-out, box-shadow 1s ease-in-out, border-radius 0.75s ease-in-out;
}

.create-job-popup input:hover {
    border: none;
    width: 65%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 4px 4px 10px #a8a8a8, -4px -4px 10px #ffffff;
}

.create-job-popup input:active,
.create-job-popup input:focus {
    border: none;
    width: 75%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 13px;
    background-color: white;
    box-shadow: 9px 9px 18px #a8a8a8, -9px -9px 18px #ffffff;
}

.create-job-popup button {
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    color: black;
    border: 1px solid black;
    cursor: pointer;
    transition: border-radius 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.6s ease-in-out, padding-left 0.3s ease-in-out, padding-right 0.3s ease-in-out;
}

.create-job-popup button:hover {
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #919191;
    border-radius: 10px;
    color: white;
    border: 1px solid #919191;
    cursor: pointer;
    box-shadow: 4px 4px 10px #a8a8a8, -4px -4px 10px #ffffff;
}

/* .create-job-popup button:active, */
.create-job-popup button:focus {
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #919191;
    border-radius: 10px;
    color: white;
    border: 1px solid #919191;
    cursor: pointer;
    box-shadow: 4px 4px 10px #a8a8a8, -4px -4px 10px #ffffff;
}

.create-job-popup button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.create-job-popup .close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
}

.create-job-popup .close-btn:hover {
    color: grey;
}

/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* Modify Job Popup Specific Styling */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

.modify-job-popup {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #ccc;
    padding: 20px;
    z-index: 1000;

    border-radius: 28px;
    background: #fff;
}

.modify-job-popup label {
    display: block;
    margin-bottom: 5px;
}

.modify-job-popup input {
    border: none;
    width: 65%;
    padding: 8px;
    background-color: #e4e4e4;
    margin-bottom: 10px;
    border-radius: 5px;
    /* box-shadow: inset 9px 9px 18px #a8a8a8,
            inset -9px -9px 18px #ffffff; */
    transition: width 0.5s ease-in-out, background-color 0.6s ease-in-out, box-shadow 1s ease-in-out, border-radius 0.75s ease-in-out;
}

.modify-job-popup input:hover {
    border: none;
    width: 65%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 8px;
    background-color: white;
    box-shadow: 4px 4px 10px #a8a8a8, -4px -4px 10px #ffffff;
}

.modify-job-popup input:active,
.modify-job-popup input:focus {
    border: none;
    width: 75%;
    padding: 8px;
    margin-bottom: 10px;
    border-radius: 13px;
    background-color: white;
    box-shadow: 9px 9px 18px #a8a8a8, -9px -9px 18px #ffffff;
}

.modify-job-popup button {
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    color: black;
    border: 1px solid black;
    cursor: pointer;
    transition: border-radius 0.3s ease-in-out, color 0.3s ease-in-out, border 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.6s ease-in-out, padding-left 0.3s ease-in-out, padding-right 0.3s ease-in-out;
}

.modify-job-popup button:hover {
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #919191;
    border-radius: 10px;
    color: white;
    border: 1px solid #919191;
    cursor: pointer;
    box-shadow: 4px 4px 10px #a8a8a8, -4px -4px 10px #ffffff;
}

/* .modify-job-popup button:active, */
.modify-job-popup button:focus {
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #919191;
    border-radius: 10px;
    color: white;
    border: 1px solid #919191;
    cursor: pointer;
    box-shadow: 4px 4px 10px #a8a8a8, -4px -4px 10px #ffffff;
}

.modify-job-popup button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.modify-job-popup .close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    font-size: 20px;
    cursor: pointer;
    transition: color 0.3s ease-in-out;
}

.modify-job-popup .close-btn:hover {
    color: grey;
}

/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* Universal Button Styles and Input Clear Styles */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

.btndiv {
    padding-left: 15px;
    display: block;
    width: 100%;
}

.btn {
    display: inline-block;
}

.clear-input {
    display: none;
}

.clear-input:hover {
    cursor: pointer;
    color: grey;
}

/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* Overlay Styling */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

.overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 999;
}
</style>
