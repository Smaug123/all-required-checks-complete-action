import * as core from '@actions/core';

interface JobData {
  result: string;
  [key: string]: any;
}

function processJob(jobName: string, jobData: JobData): number {
  const status = jobData.result;
  console.log(`Processing job: ${jobName} with status: ${status}`);

  if (status === "success") {
    console.log(`Job ${jobName} succeeded.`);
    return 0;
  } else if (status === "failure" || status === "cancelled") {
    console.log(`Job ${jobName} failed: status ${status}!`);
    return 1;
  } else {
    console.log(`Job ${jobName} has unknown status: ${status}!`);
    return 1;
  }
}

function run() {
  try {
    const needsContextJson = core.getInput('needs-context', { required: true });
    let results: { [key: string]: JobData };

    try {
      results = JSON.parse(needsContextJson);
    } catch (error) {
      core.setFailed(`Error: Unable to parse needs-context as JSON: ${error}`);
      return;
    }

    let exitStatus = 0;

    for (const [jobName, jobData] of Object.entries(results)) {
      if (typeof jobData !== 'object' || jobData === null) {
        core.setFailed(`Unexpected shape at key ${jobName}, expected an object`);
        return;
      }
      exitStatus += processJob(jobName, jobData);
    }

    if (exitStatus > 0) {
      core.setFailed(`One or more jobs failed or were cancelled`);
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
