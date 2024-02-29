const { authenticator } = require("otplib");

const secret = "u4v6zylyx643n2puavbonk5l2xryba3y"; // Make sure to replace this with your actual 2FA secret

async function login(page) {
  // Navigate to the login page
  await page.goto("https://autoloop.us/DMS/App/Notifications");

  // Step 1: Enter the username
  await page.type("#Username", "rkomprath@autoloop.com");
  await page.click("#action_next-step");

  // Wait for the password page to load
  await page.waitForSelector("#Password");

  // Step 2: Enter the password
  await page.type("#Password", "Poopslayer92!"); // Consider securely managing passwords
  await page.click("#action_sign-in");

  // Step 3: Handle 2FA
  await page.waitForSelector("#totpCode");
  const token = authenticator.generate(secret);
  await page.type("#totpCode", token);
  await Promise.all([
    page.waitForNavigation(),
    page.click(
      "#login-form > div.row.justify-content-between > div.col-md-6.text-right > button"
    ),
  ]);
}

module.exports = login;
