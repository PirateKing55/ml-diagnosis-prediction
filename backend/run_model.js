const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const getServiceName = require("./service_mapper");

async function getPrediction(jsonData) {
    try {

        const modifiedJsonData = {
            ...jsonData,
            sex: jsonData.sex === "male" ? 1 : 0
        };

        const serviceName = getServiceName(jsonData.CPT_code);

        if (!serviceName) {
            throw new Error("Invalid CPT code. No matching service found.");
        }

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn("python", ["backend/main.py", serviceName, JSON.stringify(modifiedJsonData)]);

            let outputData = "";
            let errorData = "";

            pythonProcess.stdout.on("data", (data) => {
                outputData += data.toString();
            });

            pythonProcess.stderr.on("data", (data) => {
                errorData += data.toString();
            });

            pythonProcess.on("exit", (code) => {
                if (code !== 0 || errorData) {
                    return reject(new Error(errorData || `Python script exited with code ${code}`));
                }

                if (outputData.includes("[1]")) {
                    resolve({ prediction: 1, message: "Positive (1) - High Risk" });
                } else if (outputData.includes("[0]")) {
                    resolve({ prediction: 0, message: "Negative (0) - Low Risk" });
                } else {
                    resolve({ prediction: null, message: "Unexpected Output", output: outputData.trim() });
                }
            });
        });
    } catch (error) {
        throw new Error(`Error in prediction: ${error.message}`);
    }
}

module.exports = getPrediction;


// const jsonPath = path.join(__dirname, "test.json");
// const jsonDataTest = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

// getPrediction(jsonDataTest)
//     .then((result) => console.log(result))
//     .catch((error) => console.error(error));