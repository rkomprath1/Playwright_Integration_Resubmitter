async function fetchPendingWritesCount(page) {
  const pendingWritesPageURL =
    "https://autoloop.us/DMS/App/DealershipSettings/PendingAppointmentWrites.aspx";
  const hasPendingWrites = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: "include" });
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const textContent = doc.querySelector("#content3 > h6").textContent;
    const totalCount = textContent.match(/\d+$/);
    return totalCount ? parseInt(totalCount[0], 10) : 0;
  }, pendingWritesPageURL);

  return hasPendingWrites;
}

module.exports = fetchPendingWritesCount;
