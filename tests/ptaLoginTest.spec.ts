import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/ptaLoginPage";

test.beforeEach(async ({ page }) => {
  const practiceLogin = `${process.env.BASE_URL}/practice-test-login/`;
  await page.goto(practiceLogin);
  // await page.pause()
});

test("Positive Login Test", async ({ page }) => {
  const loginPage = new LoginPage(page);

  const username = process.env.PRACTICE_USERNAME!;
  const password = process.env.PRACTICE_PASS!;
  const loggedInURL = `${process.env.BASE_URL}/logged-in-successfully/`;

  await loginPage.loginToPractice(username, password);
  await loginPage.validateLoggedIn(loggedInURL, "success");
});

test("Negative username test", async ({ page }) => {
  const loginPage = new LoginPage(page);

  const wrongUsername = "incorrectUser";
  const password = process.env.PRACTICE_PASS!;
  const loggedInURL = `${process.env.BASE_URL}/logged-in-successfully/`;

  await loginPage.loginToPractice(wrongUsername, password);
  await loginPage.validateLoggedIn(loggedInURL, "failure", "username");
});

test("Negative password test", async ({ page }) => {
  const loginPage = new LoginPage(page);

  const username = process.env.PRACTICE_USERNAME!;
  const wrongPassword = "incorrectPassword";
  const loggedInURL = `${process.env.BASE_URL}/logged-in-successfully/`;

  await loginPage.loginToPractice(username, wrongPassword);
  await loginPage.validateLoggedIn(loggedInURL, "failure", "password");
});
