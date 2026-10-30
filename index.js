import jsonfile from "jsonfile";
import moment from "moment";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const path = "./data.json";

const rl = readline.createInterface({ input, output });

async function addActivity() {
    try {
        const description = await rl.question(
            "Enter today's project activity: "
        );

        if (!description.trim()) {
            console.log("Activity cannot be empty.");
            return;
        }

        const activities = await jsonfile.readFile(path).catch(() => []);

        const activity = {
            date: moment().format("YYYY-MM-DD"),
            time: moment().format("HH:mm:ss"),
            description: description.trim()
        };

        activities.push(activity);

        await jsonfile.writeFile(path, activities, {
            spaces: 2
        });

        console.log("\nActivity saved successfully!");
        console.log(activity);

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        rl.close();
    }
}

addActivity();