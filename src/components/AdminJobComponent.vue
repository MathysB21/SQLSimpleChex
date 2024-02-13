<script>
    export default {
        name: 'AdminJobComponent',
        props: {
            time: String,
            displayTime: String,
            duration: String,
            jobType: String,
            jobName: String,
            docID: String
        },
        // setup(props) {
        //     // setup() receives props as the first argument.
        //     console.log(props)
        // }
    }
</script>

<template>
    <div class="job-container" :data-job-id="docID">
        <label>
		<p class="adminjob job-modify" :data-time="time" :data-duration="duration" :data-type="jobType" :data-name="jobName" :data-docid="docID">
            {{ jobType }} - {{ jobName }}
        </p>
        </label>
        <div class="whitespace"></div>
        <span :data-docid="docID" class="delete-icon">🗑</span>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.job-container {
    display: flex;
    align-items: center;
    margin: 0px 0px 0px 10px;
}

.whitespace {
    flex-grow: 1;
    margin: 0;
}

.job-container label:hover {
    color: grey;
}

.adminjob {
    margin-left: 5px;
    color: inherit;
    transition: color 0.2s ease;
}

.adminjob:hover {
    cursor: pointer;
    color: grey;
}

.delete-icon {
    font-size: x-large;
    cursor: pointer;
    margin-right: 20px;
    padding: 8px;
    color: black;
    transition: color 0.3s ease;
}

.delete-icon:hover {
    color: red;
}
</style>