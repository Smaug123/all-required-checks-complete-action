"use strict";
function processJob(jobName, jobData) {
    const status = jobData.result;
    console.log(`Processing job: ${jobName} with status: ${status}`);
    if (status === "success") {
        console.log(`Job ${jobName} succeeded.`);
        return 0;
    }
    else if (status === "failure" || status === "cancelled") {
        console.log(`Job ${jobName} failed: status ${status}!`);
        return 1;
    }
    else {
        console.log(`Job ${jobName} has unknown status: ${status}!`);
        return 1;
    }
}
function main() {
    const resultsJson = process.env.ALL_REQUIRED_CHECKS_COMPLETE_RESULTS || '{}';
    let results;
    try {
        results = JSON.parse(resultsJson);
    }
    catch (error) {
        console.error(`Error: Unable to parse ALL_REQUIRED_CHECKS_COMPLETE_RESULTS as JSON: ${error}`);
        return 1;
    }
    let exitStatus = 0;
    for (const [jobName, jobData] of Object.entries(results)) {
        if (typeof jobData !== 'object' || jobData === null) {
            console.error(`Unexpected shape at key ${jobName}, expected an object`);
            return 2;
        }
        exitStatus += processJob(jobName, jobData);
    }
    if (exitStatus > 0) {
        return 3;
    }
    return 0;
}
main();
