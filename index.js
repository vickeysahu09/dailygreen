import jsonfile from "jsonfile";
import moment from "moment";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const path = "./data.json";

const rl = readline.createInterface({
    input,
    output
});

async function loadActivities() {
    try {
        const data = await jsonfile.readFile(path);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

async function saveActivities(activities) {
    await jsonfile.writeFile(path, activities, {
        spaces: 2
    });
}

async function addActivity() {
    const description = await rl.question(
        "Enter your activity: "
    );

    if (!description.trim()) {
        console.log("Activity cannot be empty!");
        return;
    }

    const activities = await loadActivities();

    const activity = {
        id: Date.now(),
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm:ss"),
        description: description.trim()
    };

    activities.push(activity);

    await saveActivities(activities);

    console.log("\nActivity saved successfully!");
    console.log(activity);
}

async function viewActivities() {
    const activities = await loadActivities();

    if (activities.length === 0) {
        console.log("\nNo activities found.");
        return;
    }

    console.log("\n===== ACTIVITY HISTORY =====\n");

    activities.forEach((activity, index) => {
        console.log(`${index + 1}. ${activity.description}`);
        console.log(`   Date: ${activity.date}`);
        console.log(`   Time: ${activity.time}\n`);
    });
}

async function main() {
    console.log("\n===== DAILY GREEN TRACKER =====");
    console.log("1. Add Activity");
    console.log("2. View Activities");
    console.log("3. Exit");

    const choice = await rl.question("\nChoose an option: ");

    try {
        switch (choice) {
            case "1":
                await addActivity();
                break;

            case "2":
                await viewActivities();
                break;

            case "3":
                console.log("Thank you for using DailyGreen!");
                return;

            default:
                console.log("Invalid option!");
        }
    } catch (error) {
        console.log("Error:", error.message);
    }

    await main();
}

main().finally(() => rl.close());