<template>
    <!-- Add your child components here so Vue knows where to attach them -->
    <div class="checklist">
        <HeaderComponent />
        <SeparatorComponent />
        <MainContainerComponent />
        <SeparatorComponent />
    </div>
</template>


<script>
//Import all the child components to be used in this parent container
import HeaderComponent from './HeaderComponent.vue';
import MainContainerComponent from './MainContainerComponent.vue';
import SeparatorComponent from './SeparatorComponent.vue';

export default {
	name: 'MainChecklistComponent',
	components: {
		// In here you add all the child components of this component
		HeaderComponent,
		MainContainerComponent,
		SeparatorComponent
	}
}
</script>

<style>
/* Add styles here that you wish to be applied to the entire app */
html {
	background-color: #e0e0e0;
	font-family: 'Montserrat', sans-serif;
}

h1 {
    margin-left: 10px;
}

input {
    margin: 15px;
}

.checklist {
    list-style: none;
    width: 50%;
    margin: 30px auto;
    padding: 15px;
    border-radius: 33px;
    background-color: rgb(253, 253, 253);
    box-shadow: 32px 32px 63px #bcbcbc,
        -32px -32px 63px #ffffff;
}

.exampletext {
    color: #999999;
    font-weight: 100;
    font-size: small;
}
</style>
