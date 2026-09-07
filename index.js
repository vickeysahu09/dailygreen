import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit();

const START_DATE = "2026-07-01";
const END_DATE = "2026-09-07";

async function makeDailyCommits() {
  let date = moment(START_DATE).startOf("day");
  const endDate = moment(END_DATE).startOf("day");

  console.log("🚀 Starting daily commits...");
  console.log(`📅 From: ${START_DATE}`);
  console.log(`📅 To:   ${END_DATE}`);

  while (date.isSameOrBefore(endDate, "day")) {

    // Different time for each commit
    const commitDate = date.clone().set({
      hour: 10,
      minute: 30,
      second: 0
    });

    const formattedDate = commitDate.format();

    console.log(
      `\n📝 Creating commit for ${date.format("DD MMM YYYY")}`
    );

    // Data to write
    const data = {
      date: formattedDate,
      message: `Daily activity - ${date.format("DD MMM YYYY")}`
    };

    try {
      // Update data.json
      await jsonfile.writeFile(path, data, {
        spaces: 2
      });

      // Set Git author and committer dates
      process.env.GIT_AUTHOR_DATE = formattedDate;
      process.env.GIT_COMMITTER_DATE = formattedDate;

      // Stage file
      await git.add(path);

      // Create commit
      await git.commit(
        `Daily commit - ${date.format("DD MMM YYYY")}`,
        {
          "--date": formattedDate
        }
      );

      console.log(
        `✅ Commit created: ${date.format("DD MMM YYYY")}`
      );

    } catch (error) {
      console.error(
        `❌ Error on ${date.format("DD MMM YYYY")}:`,
        error.message
      );
    }

    // Move to next day
    date.add(1, "day");
  }

  console.log("\n🎉 All daily commits created!");

  try {
    await git.push("origin", "main");
    console.log("🚀 Successfully pushed to GitHub!");
  } catch (error) {
    console.error("❌ Push failed:", error.message);
    console.log(
      "Try: git push -u origin main --force"
    );
  }
}

makeDailyCommits();