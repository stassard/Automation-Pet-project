const { test, expect } = require("@playwright/test");
const { url } = require("inspector");

test.skip("Authentication", async ({ page }) => {
  await page.goto(
    "https://id.atlassian.com/login?application=trello&continue=https%3A%2F%2Ftrello.com%2Fauth%2Fatlassian%2Fcallback%3Fdisplay%3DeyJ2ZXJpZmljYXRpb25TdHJhdGVneSI6InNvZnQifQ%253D%253D&display=eyJ2ZXJpZmljYXRpb25TdHJhdGVneSI6InNvZnQifQ%3D%3D"
  );
  await page.click('//input[@id="username"]');
  await page.locator('//input[@id="username"]').fill("YOUR USERNAME");
  await page.click('//button[@id="login-submit"]');
  await page.click('//input[@id="password"]');
  await page.locator('//input[@id="password"]').fill("YOUR PASSWORD");
  await page.click('//button[@id="login-submit"]');

  const pageIsOpened = page.locator(
    '//button[@data-testid="header-create-menu-button"]'
  );
  await expect(pageIsOpened).toBeVisible({ timeout: 10000 });

  await page.context().storageState({ path: "authFile.json" });
});

test.describe("Trello", () => {
  test.use({
    storageState: "authFile.json",
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Create Board", async ({ page }) => {
    await page.click('//div[@class="board-tile mod-add"]');
    await page.click('//input[@type="text"]');
    await page.locator('//input[@type="text"]').fill("MyBoard");
    await page.click('//button[@data-testid="create-board-submit-button"]');
    const titleBoard = page.locator(
      '//button[@data-testid="list-composer-add-list-button"]'
    );
    await expect(titleBoard).toBeVisible();
  });

  test("Create List", async ({ page }) => {
    await page.click('//div[@title="MyBoard"]');
    await page.click('//button[@data-testid="list-composer-button"]');
    await page
      .locator('//textarea[@data-testid="list-name-textarea"]')
      .fill("MyNewList");
    await page.click('//button[@data-testid="list-composer-add-list-button"]');
    const titleList = page.locator('//h2[@class="KLvU2mDGTQrsWG"]');
    await expect(titleList).toBeVisible();
  });

  test("Create Card", async ({ page }) => {
    await page.click('//div[@title="MyBoard"]');
    await page.locator('//button[@data-testid="list-add-card-button"]').click();
    await page
      .locator('//textarea[@data-testid="list-card-composer-textarea"]')
      .fill("MyNewCard");
    await page.click(
      '//button[@data-testid="list-card-composer-add-card-button"]'
    );
    await page.click(
      '//button[@data-testid="list-card-composer-cancel-button"]'
    );
    const titleCard = page.locator('//a[@data-testid="card-name"]');
    await expect(titleCard).toBeVisible();
  });

  test("Create Checklist", async ({ page }) => {
    await page.click('//div[@title="MyBoard"]');
    await page.locator('//a[@data-testid="card-name"]').click();
    await page.click('//a[@class="button-link js-add-checklist-menu"]');
    await page.locator('//input[@id="id-checklist"]').fill("MyNewChecklist");
    await page.click('//input[@type="submit"]');

    const titleChecklist = page.locator('//div[@attr="name"]');
    await expect(titleChecklist).toBeVisible();
  });

  test("Delete Checklist", async ({ page }) => {
    await page.click('//div[@title="MyBoard"]');
    await page.locator('//a[@data-testid="card-name"]').click();
    await page.click('//a[@class="nch-button hide-on-edit js-confirm-delete"]');

    const titleDeleteButton = page.locator(
      '//input[@class="js-confirm full nch-button nch-button--danger"]'
    );
    await expect(titleDeleteButton).toBeVisible();

    await page.click(
      '//input[@class="js-confirm full nch-button nch-button--danger"]'
    );
    await page.click(
      '//button[@class="Y9J4BArcarEAX9 js-close-window dialog-close-button Yf9Zo2SU2CATQK bxgKMAm3lq5BpA HAVwIqCeMHpVKh SEj5vUdI3VvxDc"]'
    );
  });

  test("Delete Card", async ({ page }) => {
    await page.click('//div[@title="MyBoard"]');
    await page.hover('//div[@class="amUfYqLTZOvGsn"]');
    await page.click('//button[@data-testid="quick-card-editor-button"]');
    await page.click('//button[@data-testid="quick-card-editor-archive"]');
  });

  test("Delete List", async ({ page }) => {
    await page.click('//div[@title="MyBoard"]');
    await page.click('//button[@data-testid="list-edit-menu-button"]');
    await page.click('//a[@class="js-close-list"]');

    const titleDeletedList = page.locator(
      '//button[@data-testid="list-composer-button"]'
    );
    await expect(titleDeletedList).toBeVisible();
  });

  test("Delete Board", async ({ page }) => {
    await page.click('//div[@title="MyBoard"]');
    await page.click(
      '//button[@class="frrHNIWnTojsww GDunJzzgFqQY_3 bxgKMAm3lq5BpA HAVwIqCeMHpVKh SEj5vUdI3VvxDc"]'
    );
    await page.click(
      '//a[@class="board-menu-navigation-item-link board-menu-navigation-item-link-v2 js-close-board"]'
    );

    const confirmDeleteBoard = page.locator(
      '//input[@class="js-confirm full nch-button nch-button--danger"]'
    );
    await expect(confirmDeleteBoard).toBeVisible();

    await page.click(
      '//input[@class="js-confirm full nch-button nch-button--danger"]'
    );
    await page.click(
      '//button[@data-testid="close-board-delete-board-button"]'
    );
    await page.click(
      '//button[@data-testid="close-board-delete-board-confirm-button"]'
    );
    await page.click('//span[@class="icon-home icon-sm _BwhWIRGqM8j8m"]');

    await expect(page).toHaveURL("https://trello.com/");
  });

  test("Log Out", async ({ page }) => {
    await page.click('//div[@data-testid="header-member-menu-avatar"]');
    await page.click('//button[@data-testid="account-menu-logout"]');
    await page.click('//button[@id="logout-submit"]');

    const logOut = page.locator(
      '//a[@data-uuid="MJFtCCgVhXrVl7v9HA7EH_login"]'
    );
    await expect(logOut).toBeVisible();
  });
});
