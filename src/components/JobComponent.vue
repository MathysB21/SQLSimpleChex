<script>
    export default {
        name: 'JobComponent',
        props: {
            time: String,
            displayTime: String,
            duration: String,
            jobType: String,
            jobName: String
        },
        setup(props) {
            // setup() receives props as the first argument.
            console.log(props)
        }
    }
</script>

<template>
    <div class="job-container"><label>
        <input type="checkbox" class="job" :data-time="time">{{ jobType }} - {{ jobName }}
        </label><div class="time-container">
        <p>{{ displayTime }}</p>
        <p class="duration">{{ duration }}</p>
        </div><label class="ackContainer">
        <input type="checkbox" class="acknowledgment">
        </label>
    </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ackContainer {
    width: 120px;
    text-align: center;
    margin-left: 10px;
}

.duration {
    width: 100px;
}

.job-container {
    display: flex;
    align-items: center;
    margin: 0px 0px 0px 10px;
}

.time-container {
    flex-grow: 1;
    /* This makes the paragraph take up all the available space */
    margin: 0;
    /* Remove any default margins */
    text-align: right;
    /* Align the text to the right within its space */
}

.time-container p {
    display: inline-block;
}

.acknowledgment {
    margin-right: 10px;
    margin-left: 25px;
}

.job-container label:hover {
    color: grey;
}

.job {
    margin-left: 5px;
    color: inherit;
    transition: color 0.2s ease;
}

.job:hover {
    cursor: pointer;
    color: grey;
}
</style>