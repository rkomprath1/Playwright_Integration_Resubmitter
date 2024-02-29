const { chromium } = require("playwright");
const login = require("./login");
const fetchDealershipHours = require("./fetchDealershipHours");
const fetchPendingWritesCount = require("./fetchPendingWritesCount");
const resubmitter = require("./resubmitter");

async function runTasks(shellNums) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const currentDate = new Date().getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = daysOfWeek[currentDate];
  await login(page);

  for (let i = 0; i < shellNums.length; i++) {
    const url = shellNums[i];
    const isLastDealer = i === shellNums.length - 1;

    await page.goto(
      `https://autoloop.us/dms/App/CompanySelector.aspx?CompanyId=${url}`
    );
    const hasPendingWrites = await fetchPendingWritesCount(page);
    if (!hasPendingWrites) {
      if (isLastDealer) {
        console.log(`last dealer`);
      } else {
        console.log(`No pending writes for ${url}, moving to the next dealer.`);
      }

      continue;
    }

    const isOpen = await fetchDealershipHours(page);
    if (!isOpen) {
      if (isLastDealer) {
        console.log(`Dealerships is closed on ${currentDay}, last dealer`);
      } else {
        console.log(
          `Dealership is closed on ${currentDay}, moving to the next dealer.`
        );
      }
      continue;
    }

    await page.goto(
      "https://autoloop.us/DMS/App/DealershipSettings/PendingAppointmentWrites.aspx"
    );

    await resubmitter(page);
    await new Promise((resolve) => setTimeout(resolve, 20 * 1000)); // wait 20 seconds
  }
  console.log(`Completed resubmits for the following dealers: ${shellNums.join(", ")}`);
  // await browser.close();
}

async function main() {
  const tasks = [
    // runTasks([8579, 5890, 5946]),
    // runTasks([5946]),
    // runTasks([8989, 1593, 9282]),
    // runTasks([7283, 1082, 1382]),

    runTasks([2228, 2235, 2242]),
    // runTasks([2256, 2270, 2291]),
    // runTasks([2305, 2312, 2319]),
    // runTasks([2326, 2333, 2340]),
  ];

  // Run all tasks simultaneously; uncomment next line
  //await Promise.all(tasks);
}

main().catch(console.error);
