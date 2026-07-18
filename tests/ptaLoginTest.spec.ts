import { test, expect } from "@playwright/test";
import { PtaLoginPage } from "../pages/ptaLoginPage";
import { PtaLogoutPage } from "../pages/ptaLogoutPage";

test.beforeEach(async ({ page }) => {
  const practiceLogin = `${process.env.PTA_BASE_URL}/practice-test-login/`;
  await page.goto(practiceLogin);
  // await page.pause()
});

test("Positive Login Test", async ({ page }) => {
  const ptaLoginPage = new PtaLoginPage(page);
  const ptaLogoutPage = new PtaLogoutPage(page)

  const username = process.env.PTA_PRACTICE_USERNAME!;
  const password = process.env.PTA_PRACTICE_PASS!;
  const loggedInURL = `${process.env.PTA_BASE_URL}/logged-in-successfully/`;

  await ptaLoginPage.loginToPta(username, password);
  await ptaLogoutPage.validateLoggedIn(loggedInURL, "success");
});

test("Negative username test", async ({ page }) => {
  const ptaLoginPage = new PtaLoginPage(page);
  const ptaLogoutPage = new PtaLogoutPage(page)

  const wrongUsername = "incorrectUser";
  const password = process.env.PTA_PRACTICE_PASS!;
  const loggedInURL = `${process.env.PTA_BASE_URL}/logged-in-successfully/`;

  await ptaLoginPage.loginToPta(wrongUsername, password);
  await ptaLogoutPage.validateLoggedIn(loggedInURL, "failure", "username");
});

test("Negative password test", async ({ page }) => {
  const ptaLoginPage = new PtaLoginPage(page);
  const ptaLogoutPage = new PtaLogoutPage(page)

  const username = process.env.PTA_PRACTICE_USERNAME!;
  const wrongPassword = "incorrectPassword";
  const loggedInURL = `${process.env.PTA_BASE_URL}/logged-in-successfully/`;

  await ptaLoginPage.loginToPta(username, wrongPassword);
  await ptaLogoutPage.validateLoggedIn(loggedInURL, "failure", "password");
});
