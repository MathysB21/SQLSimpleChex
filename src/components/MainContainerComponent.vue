<template>
	<!-- Main container for all the jobs -->
	<div class="jobs-container" id="jobs-container"></div>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import JobComponent from './JobComponent.vue';
import { createApp, h } from 'vue';

export default {
	name: 'MainContainerComponent',
	mounted() {

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

		const jobsContainer = document.getElementById('jobs-container');
		const jobsLoadedEvent = new Event('jobsLoadedEvent');

		const jobsCollectionName = process.env.VUE_APP_JOBS_COLLECTION;
		// Assuming you have a 'jobs' collection in Firestore
		const jobsCollection = collection(db, jobsCollectionName);

		const jobsQuery = query(jobsCollection, orderBy('time'));

		getDocs(jobsQuery).then((querySnapshot) => {
			let previousTime = null; // Store the previous job time

			querySnapshot.forEach((doc) => {
				const job = doc.data();

				if (previousTime && previousTime !== job.time) {
					// Add an <hr> element if the time has changed
					const hr = document.createElement('hr');
					jobsContainer.appendChild(hr);
				}

				console.log("Added a job");
				// Create the app
				const app = createApp({
					render: () => h(JobComponent, {
						// Pass props directly
						time: job.time,
						displayTime: job.displayTime,
						duration: job.displayDuration,
						jobType: job.type,
						jobName: job.name,
					}),
				});

				// Create a new element to mount the app
				const appContainer = document.createElement('div');

				// Mount the app to the element
				app.mount(appContainer);

				// Append the component's element to the jobsContainer
				jobsContainer.appendChild(appContainer)

				// Update previousTime
				previousTime = job.time;
			});

			// Dispatch the custom event when this function is done
			document.dispatchEvent(jobsLoadedEvent);
		})
			.catch(error => console.error('Error fetching jobs:', error));
	}
}

const intervalToCheckJobsInSeconds = 60;
const intervalToCheckBoxesInSeconds = 1;

let notifInProgress = false;

// Check the jobs, if a job's time matches the current time, mark it
function checkJobs() {
	console.log("Checking the jobs")
	const jobs = document.querySelectorAll('.job');
	const acknowledgments = document.querySelectorAll('.acknowledgment');

	for (let i = 0; i < jobs.length; i++) {
		const job = jobs[i];
		const acknowledgment = acknowledgments[i];
		const currentTime = new Date();
		const currentHour = currentTime.getHours();

		// This clause stops you from being bombarded when you get to night shift
		if (currentHour >= 19) {
			job.parentNode.classList.add('okay');
			return; // Exit the loop, no notifications should be sent
		}

		const jobTimeStr = job.getAttribute('data-time');
		const jobTimeArray = jobTimeStr.split(':');
		const jobTime = new Date();
		jobTime.setHours(jobTimeArray[0], jobTimeArray[1], jobTimeArray[2]);

		// If acknowledged, skip this clause
		if (!acknowledgment.checked) {
			if (job.checked) {
				// If the job is not acknowledged, but it's checked, do nothing
			} else if (currentTime > jobTime) {
				// Check if notifications are supported
				if ("Notification" in window) {
					if (Notification.permission !== "granted") {
						Notification.requestPermission().then(function (permission) {
							if (permission === "granted" && notifInProgress === false) {
								sendNotification(job);
								notifInProgress = true;
								setTimeout(() => {
									// notificationInProgress = false;
									notifInProgress = false; // Reset the sound flag after a delay
								}, 5000); // Set the delay to the desired duration in milliseconds
							} else if (permission === 'granted' && notifInProgress === true) {
								console.log("There is already a notification in progress...")
							}
						});
					} else if (Notification.permission === "granted") {
						if (notifInProgress === false) {
							sendNotification(job);
							notifInProgress = true;
							setTimeout(() => {
								// notificationInProgress = false;
								notifInProgress = false; // Reset the sound flag after a delay
							}, 5000); // Set the delay to the desired duration in milliseconds
						} else {
							console.log("There is already a notification in progress...")
						}
					}
				}
			}
		}
	}
}

function sendNotification(job) {
	new Notification('Job Overdue', {
		body: `${job.parentNode.innerText} has not been checked, and the scheduled time has passed.`,
	});

	
	const sound = new Audio(require('@/assets/elegant-notification-sound.mp3'));
	sound.play().then(() => {
		console.log('Playing a sound');
	}).catch(error => {
		console.error('Error playing sound:', error);
	});
	

	console.log("Sending a notification")
}

function checkBoxes() {
	const jobs = document.querySelectorAll('.job');

	for (let i = 0; i < jobs.length; i++) {
		const job = jobs[i];
		const currentTime = new Date();
		const currentHour = currentTime.getHours();

		if (currentHour >= 19) {
			job.parentNode.classList.add('okay');
		} else {
			const jobTimeStr = job.getAttribute('data-time');
			const jobTimeArray = jobTimeStr.split(':');
			const jobTime = new Date();
			jobTime.setHours(jobTimeArray[0], jobTimeArray[1], jobTimeArray[2]);

			if (job.checked) {
				job.parentNode.classList.remove('warning');
			} else if (currentTime > jobTime) {
				job.parentNode.classList.add('warning');
			}
		}
	}
}

document.addEventListener('jobsLoadedEvent', function () {
	const jobCheckboxes = document.querySelectorAll('.job');

	jobCheckboxes.forEach(jobCheckbox => {
		jobCheckbox.addEventListener('change', function () {
			const currentTime = new Date();
			const currentHour = currentTime.getHours();

			if (this.checked) {
				addOkayClass(this.parentElement); // Pass the parent label element
				console.log("Okay")
			}

			if (currentHour >= 19) {
				addOkayClass(this.parentElement);
			} else if (!this.checked) {
				const currentTime = new Date();

				const jobTimeStr = jobCheckbox.getAttribute('data-time');
				const jobTimeArray = jobTimeStr.split(':');
				const jobTime = new Date();
				jobTime.setHours(jobTimeArray[0], jobTimeArray[1], jobTimeArray[2]);

				if (currentTime > jobTime) {
					addWarnClass(this.parentElement);
					console.log("Warn")
				}
			}
		});
	});
});

function addOkayClass(labelElement) {
	labelElement.classList.add('okay');
	labelElement.classList.remove('warning');
}

function addWarnClass(labelElement) {
	labelElement.classList.add('warning');
	labelElement.classList.remove('okay');
}

// Check if the job checkbox is checked and then unchecks the acknowledgement checkbox
document.addEventListener('jobsLoadedEvent', function () {
	console.log("Page loaded, checking for all the job containers")
	const jobContainers = document.querySelectorAll('.job-container');

	jobContainers.forEach(container => {
		const jobCheckbox = container.querySelector('.job');
		const ackCheckbox = container.querySelector('.acknowledgment');

		jobCheckbox.addEventListener('change', function () {
			if (this.checked) {
				ackCheckbox.checked = false;
			}
		});

	});
});

// Check the jobs
setInterval(checkJobs, intervalToCheckJobsInSeconds * 1000);

// Check the checkboxes to change the colour in realtime
setInterval(checkBoxes, intervalToCheckBoxesInSeconds * 1000);

</script>

<!-- Add "scoped" attribute to limit CSS to this component only, or remove it if you want to apply to other components -->
<style>
.warning {
	color: red;
}

.okay {
	color: black;
}
</style>