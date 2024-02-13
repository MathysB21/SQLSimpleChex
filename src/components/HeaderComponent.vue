<template>
    <!-- Header row in checklist -->
    <div class="header-container">
        <h1 class="clickall" @click="clickPastJobs()">SQL Job Checklist</h1>
        <div class="time-container"></div>
        <!-- <a href="admin.html" class="admin"><strong>Admin</strong></a> -->
        <router-link to="/admin" class="admin"><strong>Admin</strong></router-link>
        <p class="ackAll" @click="acknowledgeAll()"><strong>Acknowledge</strong></p> 
    </div>
</template>

<script setup>
// export default {
// name: 'HeaderComponent'
// }

function acknowledgeAll() {
	const acknowledgmentCheckboxes = document.querySelectorAll('.acknowledgment');
	acknowledgmentCheckboxes.forEach(checkbox => {
		checkbox.checked = true;
	});
}

function clickPastJobs() {
	const jobs = document.querySelectorAll('.job');

	for (let i = 0; i < jobs.length; i++) {
		const job = jobs[i];
		const currentTime = new Date();

		const jobTimeStr = job.getAttribute('data-time');
		const jobTimeArray = jobTimeStr.split(':');
		const jobTime = new Date();
		jobTime.setHours(jobTimeArray[0], jobTimeArray[1], jobTimeArray[2]);

		if (currentTime > jobTime) {
			// Check the box
			job.checked = true;
			// Manually dispatch the change event on the acknowledgment checkbox
			const event = new Event('change');
			job.dispatchEvent(event);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-container {
    display: flex;
    align-items: center;
    margin: 0px 0px 0px 10px;
}

.ackAll:hover {
    color: grey;
    cursor: pointer;
}

.refresh:hover {
    cursor: pointer;
}

.admin {
    margin-right: 30px;
    text-decoration: none;
    color: inherit;
}

.admin:hover {
    color: grey;
    cursor: pointer;
}

.time-container {
    flex-grow: 1;
    /* This makes the paragraph take up all the available space */
    margin: 0;
    /* Remove any default margins */
    text-align: right;
    /* Align the text to the right within its space */
}
</style>