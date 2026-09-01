import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

async function makeCommits(n) {
  if (n <= 0) {
    console.log("✅ Finished.");

    try {
      await git.push();
      console.log("🚀 Pushed to GitHub.");
    } catch (error) {
      console.error("❌ Push failed:", error.message);
    }

    return;
  }

  // Current date: 1 September 2026
  const today = moment().startOf("day");

  // Only select today or an earlier date
  const daysAgo = random.int(0, 365);

  const date = today
    .clone()
    .subtract(daysAgo, "days")
    .set({
      hour: random.int(9, 18),
      minute: random.int(0, 59),
      second: random.int(0, 59)
    })
    .format();

  console.log(`Commit ${n}: ${date}`);

  const data = {
    date: date
  };

  try {
    // Update data.json
    await jsonfile.writeFile(path, data);

    // Keep Git dates consistent
    process.env.GIT_AUTHOR_DATE = date;
    process.env.GIT_COMMITTER_DATE = date;

    // Stage file
    await git.add(path);

    // Create commit
    await git.commit(date, {
      "--date": date
    });

    // Continue
    await makeCommits(n - 1);

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Number of commits
makeCommits(100);