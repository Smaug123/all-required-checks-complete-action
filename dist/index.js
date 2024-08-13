"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const needsContextJson = core.getInput('needs-context', { required: true });
            let results;
            try {
                results = JSON.parse(needsContextJson);
            }
            catch (error) {
                core.setFailed("Error: Unable to parse needs-context as JSON");
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
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
