import { type Locator, type Page, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly loggedInHeading: Locator;
  readonly loggedInMessage: Locator;
  readonly passwordField: Locator;
  readonly usernameField: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loginButton = page.getByRole("button", { name: "Submit" });
    this.logoutButton = page.getByRole("link", { name: "Log out" });
    this.loggedInHeading = page.getByRole("heading", {
      name: "Logged In Successfully",
    });
    this.loggedInMessage = page.getByText(
      "Congratulations student. You successfully logged in!"
    );
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.usernameField = page.getByRole("textbox", { name: "Username" });
  }

  errorMessage(messageType: "username" | "password"): Locator {
    return this.page
      .locator("#error")
      .getByText(`Your ${messageType} is invalid!`);
  }

  async loginToPractice(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async validateErrorMessageVisibility(
    isErrorMessageVisible: boolean,
    whichError?: "username" | "password"
  ): Promise<void> {
    if (isErrorMessageVisible === false) {
      await Promise.all([
        expect(this.errorMessage("username")).toBeHidden(),
        expect(this.errorMessage("password")).toBeHidden(),
      ]);
    }

    if (whichError === "username") {
      await Promise.all([
        expect(this.errorMessage("username")).toBeVisible(),
        expect(this.errorMessage("password")).toBeHidden(),
      ]);
    } else if (whichError === "password") {
      await Promise.all([
        expect(this.errorMessage("username")).toBeHidden(),
        expect(this.errorMessage("password")).toBeVisible(),
      ]);
    }
  }

  async validateLoggedIn(
    url: string,
    expectedResult: "success" | "failure",
    errorMessageType?: "username" | "password"
  ): Promise<void> {
    if (expectedResult === "failure") {
      await Promise.all([
        this.validateErrorMessageVisibility(true, errorMessageType),
        expect(this.page).not.toHaveURL(url),
        expect(this.loggedInHeading).toBeHidden(),
        expect(this.loggedInMessage).toBeHidden(),
        expect(this.logoutButton).toBeHidden(),
      ]);
    }

    if (expectedResult === "success") {
      await Promise.all([
        expect(this.page).toHaveURL(url),
        this.validateErrorMessageVisibility(false),
        expect(this.loggedInHeading).toBeVisible(),
        expect(this.loggedInMessage).toBeVisible(),
        expect(this.logoutButton).toBeVisible(),
      ]);
    }
  }
}
