<template>
	<!-- Main container for all the jobs -->
	<div class="jobs-container" id="jobs-container"></div>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import AdminJobComponent from './AdminJobComponent.vue';
import { createApp, h } from 'vue';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Access Firestore directly from the initialized app
const db = getFirestore(app);

const adminJobsLoadedEvent = new Event('adminJobsLoadedEvent');
const jobsCollection = collection(db, 'cgpjobs');
const jobsQuery = query(jobsCollection, orderBy('time'));
let createJobPopup;
// const createJobForm;
let modifyJobPopup;
// const modifyJobForm;
let closeCreateJobPopupBtn;
let submitCreateJobFormBtn;
let submitCloseCreateJobFormBtn;
let closeModifyJobPopupBtn;
let saveCloseModifyJobFormBtn;
let cancelModifyBtn;
let confirmDeleteJobBtn;
let cancelDeleteJobBtn;

// DOMContentLoaded block to get the elements once the content of the page has been loaded
document.addEventListener('DOMContentLoaded', function() {
    // console.log("Content Loaded")
    createJobPopup = document.getElementById('createJobPopup');
    // console.log(createJobPopup)
    // createJobForm = document.getElementById('createJobForm');
    modifyJobPopup = document.getElementById('modifyJobPopup');
    // console.log(modifyJobPopup)
    // modifyJobForm = document.getElementById('modifyJobForm');
    closeCreateJobPopupBtn = document.getElementById('closeCreateJobPopupBtn');
    submitCreateJobFormBtn = document.getElementById('submitCreateJobFormBtn');
    submitCloseCreateJobFormBtn = document.getElementById('submitCloseCreateJobFormBtn');
    closeModifyJobPopupBtn = document.getElementById('closeModifyJobPopupBtn');
    saveCloseModifyJobFormBtn = document.getElementById('saveCloseModifyJobFormBtn');
    cancelModifyBtn = document.getElementById('cancelModifyBtn');
    confirmDeleteJobBtn = document.getElementById('confirmDeleteJob');
    cancelDeleteJobBtn = document.getElementById('cancelDeleteJob');

    // Create Job Popup Event listeners
    // Attach event listener to close popup button
    if (closeCreateJobPopupBtn) {
        closeCreateJobPopupBtn.addEventListener('click', closeRefreshCreateJobPopup);
    }
    // Attach event listener to submit button
    if (submitCreateJobFormBtn) {
        submitCreateJobFormBtn.addEventListener('click', submitCreateJobForm);
    }
    // Attach event listener to submit & close button
    if (submitCloseCreateJobFormBtn) {
        submitCloseCreateJobFormBtn.addEventListener('click', submitCloseCreateJobForm);
    }
    // Modify Job Popup Event listeners
    // Attach event listener to close popup button
    if (closeModifyJobPopupBtn) {
        closeModifyJobPopupBtn.addEventListener('click', closeModifyJobPopup);
    }
    // Attach event listener to submit & close button
    if (saveCloseModifyJobFormBtn) {
        saveCloseModifyJobFormBtn.addEventListener('click', saveCloseModifyJobForm);
    }
    // Attach event listener to cancel button
    if (cancelModifyBtn) {
        cancelModifyBtn.addEventListener('click', closeModifyJobPopup);
    }
    //Add the event listeners to the Yes and no buttons inside the confirmation popup
    if (confirmDeleteJobBtn) {
        confirmDeleteJobBtn.addEventListener('click', confirmDeleteJob);
    }
    if (cancelDeleteJobBtn) {
        cancelDeleteJobBtn.addEventListener('click', cancelDeleteJob);
    }

    // Attach event listeners to clear buttons
    document.querySelectorAll('.clear-input').forEach(clearButton => {
        clearButton.addEventListener('click', function () {
            const inputId = this.previousElementSibling.id;
            clearInput(inputId);
        });
    });
});

let deleteInProgressJobID;

export default {
	name: 'AdminMainContainerComponent',
	mounted() {
        const jobsContainer = document.getElementById('jobs-container');
        document.getElementById("createJobBtn").addEventListener('click', function () {
            openCreateJobPopup();
        })

        getDocs(jobsQuery).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const job = doc.data();

                // console.log("Added a job");
                // Create the app
                const app = createApp({
                    render: () => h(AdminJobComponent, {
                        // Pass props directly
                        time: job.time,
                        displayTime: job.displayTime,
                        duration: job.displayDuration,
                        jobType: job.type,
                        jobName: job.name,
                        docID: doc.id
                    }),
                });

                // document.querySelectorAll('.delete-icon').forEach(element => {
                //     element.addEventListener('click', function () {
                //         console.log("Added Event Listener")
                //         deleteJobWithConfirmation(doc.id)
                //     });
                // });

                // Create a new element to mount the app
                const appContainer = document.createElement('div');

                // Mount the app to the element
                app.mount(appContainer);

                // Append the component's element to the jobsContainer
                jobsContainer.appendChild(appContainer)
            });

            // Dispatch the custom event when this function is done
            document.dispatchEvent(adminJobsLoadedEvent);
        })
            .catch(error => console.error('Error fetching jobs:', error));
                
            }
}

// Add event listener to the create job button
document.querySelectorAll('.job-create').forEach(element => {
    element.addEventListener('click', function () {
        openCreateJobPopup();
    });
});

// You need to wait for the jobs to load before you can actually attach the eventlisteners
document.addEventListener('adminJobsLoadedEvent', function () {
    // Add event listener to the job names to open the modify job popup
    document.querySelectorAll('.job-modify').forEach(element => {
        element.addEventListener('click', function () {
            // Access data attributes
            const jDocID = this.dataset.docid;
            const jType = this.dataset.type;
            const jName = this.dataset.name;
            const jTime = this.dataset.time;
            const jDuration = this.dataset.duration;

            openModifyJobPopup(jDocID, jType, jName, jTime, jDuration);
        });
    });

    document.querySelectorAll('.delete-icon').forEach(element => {
        element.addEventListener('click', function () {
            // console.log("Dataset docid:",this.dataset.docid)
            deleteJobWithConfirmation(this.dataset.docid)
        });
    });
});

// document.addEventListener('adminJobsLoadedEvent', function () {
//     // Add an event listener to all the delete-icons on the page
//     document.querySelectorAll('.delete-icon').forEach(element => {
//         element.addEventListener('click', function () {
//             deleteJobWithConfirmation(docID)
//         })
//     })
// });

// Function to delete the job should the dustbin be clicked
function deleteJob(jobId) {
	const jobDocRef = doc(db, 'cgpjobs', jobId);
	const jobContainer = document.querySelector(`[data-job-id="${jobId}"]`);
	const popup = document.getElementById('jobDeletedPopup');

	deleteDoc(jobDocRef)
		.then(() => {
			console.log('Job deleted successfully');
			// Hide the job container
			jobContainer.style.display = 'none';
			// Display the success popup
			displayTinyPopup(popup);
		})
		.catch((error) => {
			console.error('Error deleting job:', error);
		});
}

function deleteJobWithConfirmation(jobId) {
    showConfirmationPopup();
    // Store jobId in a variable accessible to confirmDeleteJob function
    // console.log(jobId)
    deleteInProgressJobID = jobId;
}

// Function to display the confirmation popup
function showConfirmationPopup() {
    const popup = document.getElementById('confirmationPopup');
    popup.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Function to hide the confirmation popup
function hideConfirmationPopup() {
    const popup = document.getElementById('confirmationPopup');
    popup.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    deleteInProgressJobID = null;
}

// Function to confirm the deletion
function confirmDeleteJob() {
    // Call your deleteJob function or perform the deletion logic here
    // console.log(deleteInProgressJobID)
    deleteJob(deleteInProgressJobID);  // Assuming jobId is the ID of the job you want to delete
    hideConfirmationPopup();
}

// Function to cancel the deletion
function cancelDeleteJob() {
    hideConfirmationPopup();
}

function displayTinyPopup(popup) {
	// Display the popup
	popup.style.display = 'block';

	// Hide the popup after 3 seconds (adjust as needed)
	setTimeout(() => {
		popup.style.display = 'none';
	}, 1500);
}

function openCreateJobPopup() {
    createJobPopup.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeCreateJobPopup() {
    createJobPopup.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
	clearCreateJobForm();
}
function closeRefreshCreateJobPopup() {
    createJobPopup.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
	clearCreateJobForm();
    refreshPage();
}

function clearCreateJobForm() {
    document.getElementById('jobType').value = '';
    document.getElementById('jobName').value = '';
    document.getElementById('jobTime').value = '';
    document.getElementById('jobDuration').value = '';
}

function submitCreateJobForm() {
    const jobType = document.getElementById('jobType').value;
    const jobName = document.getElementById('jobName').value;
    const jobTime = document.getElementById('jobTime').value;
    const jobDuration = document.getElementById('jobDuration').value;

    if (jobType && jobName && jobTime && jobDuration) {
        // Push information to Firestore
        addJobToFirestore(jobType, jobName, jobTime, jobDuration);

		// Display the popup
		const popup = document.getElementById('jobCreatedPopup');
		displayTinyPopup(popup);
        console.log('Job created successfully');
    } else {
        alert('Please fill in all fields before submitting.');
    }
}

function submitCloseCreateJobForm() {
    const jobType = document.getElementById('jobType').value;
    const jobName = document.getElementById('jobName').value;
    const jobTime = document.getElementById('jobTime').value;
    const jobDuration = document.getElementById('jobDuration').value;

    if (jobType && jobName && jobTime && jobDuration) {
        // Push information to Firestore
        addJobToFirestoreRefresh(jobType, jobName, jobTime, jobDuration);

		//Display the popup
		const popup = document.getElementById('jobCreatedPopup');
		displayTinyPopup(popup);
        console.log('Job created successfully');

		// Close the popup upon submission
        closeCreateJobPopup();
    } else {
        alert('Please fill in all fields before submitting.');
    }
}

// Modify Job Functions
function openModifyJobPopup(jDocID, jType, jName, jTime, jDuration) {
    modifyJobPopup.style.display = 'block';
    document.getElementById('overlay').style.display = 'block';

    // Find the inputs inside the popup and fill them with info that is passed to the function    
    document.getElementById("mjobDocID").value = jDocID;
    document.getElementById("mjobType").value = jType;
    showClearButton("mjobType");
    document.getElementById("mjobName").value = jName;
    showClearButton("mjobName");
    document.getElementById("mjobTime").value = jTime;
    showClearButton("mjobTime");
    document.getElementById("mjobDuration").value = jDuration;
    showClearButton("mjobDuration");
}

function closeModifyJobPopup() {
    modifyJobPopup.style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
	clearModifyJobForm();
}

function clearModifyJobForm() {
    document.getElementById('mjobType').value = '';
    document.getElementById('mjobName').value = '';
    document.getElementById('mjobTime').value = '';
    document.getElementById('mjobDuration').value = '';
}

function saveCloseModifyJobForm() {
    const docId = document.getElementById('mjobDocID').value;
    const jobType = document.getElementById('mjobType').value;
    const jobName = document.getElementById('mjobName').value;
    const jobTime = document.getElementById('mjobTime').value;
    const jobDuration = document.getElementById('mjobDuration').value;

    if (jobType && jobName && jobTime && jobDuration) {
        // Push information to Firestore
        // You need to create a function that uses setDoc instead of this addDoc one
        updateJobInFirestore(docId, jobType, jobName, jobTime, jobDuration);

		//Display the popup
		const popup = document.getElementById('jobModifiedPopup');
		displayTinyPopup(popup);
        console.log('Job modified successfully');

		// Close the popup upon submission
        closeModifyJobPopup();
    } else {
        alert('Please fill in all fields before submitting.');
    }
}

// Clear button for input fields functions and event listeners

// Function to clear the input field and hide the clear button
function clearInput(inputId) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.value = '';
        hideClearButton(inputId);
    }
}

// Function to show the clear button when the input has content
function showClearButton(inputId) {
    const clearButton = document.querySelector(`#${inputId} + .clear-input`);
    if (clearButton) {
        clearButton.style.display = 'inline-block';
    }
}

// Function to hide the clear button when the input is empty
function hideClearButton(inputId) {
    const clearButton = document.querySelector(`#${inputId} + .clear-input`);
    if (clearButton) {
        clearButton.style.display = 'none';
    }
}

// Attach event listeners to input elements
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
        const inputId = this.id;
        if (this.value.trim() !== '') {
            showClearButton(inputId);
        } else {
            hideClearButton(inputId);
        }
    });
});

// Function to push information to Firestore
async function addJobToFirestore(jobType, jobName, jobTime, jobDuration) {
    try {
        // Reference to the 'cgpjobs' collection in Firestore
        const jobsCollectionRef = collection(db, "cgpjobs");

		let shorttime = jobTime.slice(0,5);

        // Add a new document to the collection directly
        await addDoc(jobsCollectionRef, {
            type: jobType,
            name: jobName,
            time: jobTime,
            displayDuration: jobDuration,
            displayTime: shorttime
        });

        console.log('Job added to Firestore successfully');
    } catch (error) {
        console.error('Error adding job to Firestore:', error);
    }
}
// Function to push information to Firestore
async function addJobToFirestoreRefresh(jobType, jobName, jobTime, jobDuration) {
    try {
        // Reference to the 'cgpjobs' collection in Firestore
        const jobsCollectionRef = collection(db, "cgpjobs");

		let shorttime = jobTime.slice(0,5);

        // Add a new document to the collection
        await addDoc(jobsCollectionRef, {
            type: jobType,
            name: jobName,
            time: jobTime,
            displayDuration: jobDuration,
            displayTime: shorttime
        });

        console.log('Job added to Firestore successfully');
        refreshPage();
    } catch (error) {
        console.error('Error adding job to Firestore:', error);
    }
}

// Function to update information in Firestore
async function updateJobInFirestore(docId, jobType, jobName, jobTime, jobDuration) {
    try {
        // Reference to the 'cgpjobs' collection and the specific document in Firestore
        const jobDocRef = doc(collection(db, "cgpjobs"), docId);

        let shorttime = jobTime.slice(0, 5);

        // Update the existing document in the collection
        await updateDoc(jobDocRef, {
            type: jobType,
            name: jobName,
            time: jobTime,
            displayDuration: jobDuration,
            displayTime: shorttime
        });

        console.log('Job updated in Firestore successfully');
        refreshPage();
    } catch (error) {
        console.error('Error updating job in Firestore:', error);
    }
}

function refreshPage() {
    // console.log("refreshing")
    location.reload();
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only, or remove it if you want to apply to other components -->
<style>

</style>