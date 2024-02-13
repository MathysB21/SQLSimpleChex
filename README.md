# SQLSimpleChex
This is a checklist for helping to monitor and keeping check on SQL Jobs and when they should run.

## About
This checklist can be used to keep track of SQL jobs and when they should run. The jobs you add will notify you via a desktop notification and a sound that plays when they should have ran. Note that you make sure to allow notifications and playing sounds inside your browser. The preferred browser is Google Chrome. 

You will need to create jobs and set the times the jobs need to run, and when the time is reached a desktop notification and a sound will notify you that a job should have ran.

## Initialising the project
Simply clone the project and then simply run the following command to install all the packages listed in the package.json file:

npm install (As easy as that)

## Setting up the .env file
Please note that you need to configure your Firebase Database (Firestore) Config details in the .env file. The format should look like the following:

VUE_APP_FIREBASE_API_KEY="your_api_key"
VUE_APP_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VUE_APP_FIREBASE_PROJECT_ID="your_project_id"
VUE_APP_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
VUE_APP_FIREBASE_MESSAGING_SENDER_ID="your_messaging_sender_id"
VUE_APP_FIREBASE_APP_ID="your_app_id"
VUE_APP_JOBS_COLLECTION='your_jobs_collection_name'

## Running the server
Open a command prompt in the root folder then type any of the following commands depending on your situation:

npm run serve (This command allows hot reloading when you save changes. Use this when you are making changes in the code.)

npm run build (This command creates the production build. This is the one you should use when all changes are finalised.)

## Creating Jobs
This application was created specifically with Postilion or Payments SQL jobs in mind. Keep this in mind when creating jobs.
To create a job you will need to go the Admin route and click on the create job button in the header. 

A dialog will appear in the middle of the page asking for details about this job.
Job Type: This is the type of SQL job, it could be anything from DataSummary to Settlement and Billing Jobs.
Job Name: This is the personalised name of the job. It could be the name of the vendor, acquirer or issuer.
Job Time: This is the time the job should take place. Please note that this is 24-hour time.
Job Duration: This is the duration of the job and is only displayed for visual purposes. It is not used in calculations. Thus, you can insert any duration like: 12 sec, 20 mins, 2 hrs.

You can then choose to save and close which will save the job and close the dialog or just save so the dialog stays open for you to add more jobs.

## Modifying Jobs
Modifying jobs is an easy task, simply click on the name of the job you would like to modify and a dialog will open in which you can edit the data associated with that job. Should an error arise, simply reload the page and try again.

## Deleting Jobs
Deleting jobs is another easy task. You simply need to click on the trash icon on the right side of the job and a dialog asking you to confirm will pop up. By clicking yes, the job will be deleted immediately.

## Creating the Firestore Database
To create a Firestore Database, you need a Firebase project, and for this you will need to create an account if you don't have one already.
After signing in and creating a new project, create the Firestore Database.

Inside this Database, make sure to only create a collection with a name like 'sqljobs' and then include this name in the .env file in the VUE_APP_JOBS_COLLECTION variable.

This application contains no authentication mechanisms yet, meaning you will need to adjust the rules of the Firestore Database to allow all unauthenticated requests. Your rules will need to look something like the following:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access to all users
    match /{document=**} {
      allow read, write: if request.auth == null;
    }
  }
}

## Using the checklist
For everyday use of the checklist you will need to open the following URL in your web browser: localhost:8080/chex
For using the admin part of this app you will need to open this URL: localhost:8080/admin

Note that your port (The number after the :) may differ if you are already running other services or applications that use those ports.

For monitoring, once a job is supposed to run it will mark the job name red and then do the notifying process. To silence the alarm, select the checkbox to the right of the job name. To complete the job, select the checkbox to the left of the job name. You will notice that if you had silenced the alarm on a job and the complete the job, the checkbox on the right side of the name will be unchecked, this is an intended function. Both do not need to be selected.

Clicking the checkbox on the right of the job silences the alarm, but keeps the job marked as incomplete.
Clicking the checkbox on the left of the job silences the alarm, clears the checkbox on the right and marks the job as complete.

## Costs
Everything about this project is free and you can even host the Database for free as long as you stay within the free tier thresholds that Firebase has set out. I do not charge any fees either, all I ask is that my work be acknowledged in the project and maybe a thank you email, I get immense satisfaction from this alone.

Should you wish to add more than 200 SQL jobs, you might go over the free tier's daily thresholds, but then upgrading your Firebase account to a Blaze plan is cheap and easy. You can do this inside Firebase, but it's not necessary for smaller companies.