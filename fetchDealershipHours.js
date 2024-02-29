async function fetchDealershipHours(page) {
  const companySettingsURL =
    "https://autoloop.us/DMS/App/DealershipSettings/Company.aspx";
  const isOpen = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: "include" });
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const currentDate = new Date().getDay();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = daysOfWeek[currentDate];
    const openTimeDropdownId = `ctl00_ctl00_Main_Main_och${currentDay}_ddlOpen`;
    const openTimeDropdown = doc.getElementById(openTimeDropdownId);
    const selectedOption =
      openTimeDropdown?.querySelector("option:checked")?.value;
    return selectedOption && selectedOption !== "";
  }, companySettingsURL);
  console.log(isOpen);
  return isOpen;
}
module.exports = fetchDealershipHours;
