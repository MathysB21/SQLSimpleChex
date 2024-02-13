<template>
    <!-- Header row in checklist -->
    <div class="header-container">
        <h1 class="clickall">Admin Page</h1>
        <div class="time-container"></div>
        <p class="job-create admin" id="createJobBtn">Create Job</p>
        <router-link to="/chex" class="admin"><strong>Checklist</strong></router-link>
    </div>
</template>

<script setup>
// export default {
// name: 'HeaderComponent'
// }
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