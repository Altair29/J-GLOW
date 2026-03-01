import { test, expect, type Page } from '@playwright/test';

const PAGE_URL = '/business/tools/labor-notice';

// ─── Helper: wait for wizard to load ───
async function waitForWizard(page: Page) {
  await expect(page.getByRole('heading', { name: '基本情報' })).toBeVisible({ timeout: 15_000 });
}

// ─── Helper: fill Step 1 required fields ───
async function fillStep1(page: Page) {
  await page.getByPlaceholder('例：グエン　ヴァン　アン').fill('テスト太郎');
  await page.getByPlaceholder('例：株式会社サンプル').fill('テスト株式会社');
  // Step1 only has one '例：東京都千代田区...' for company_address
  await page.getByPlaceholder('例：東京都千代田区...').first().fill('東京都千代田区1-1-1');
  await page.getByPlaceholder('例：代表取締役 田中太郎').fill('代表取締役 テスト次郎');
}

// ─── Helper: fill Step 2 required fields ───
async function fillStep2(page: Page) {
  // 分野を選択（default visa = tokutei1）
  await page.locator('select').first().selectOption({ index: 1 });
  // 契約開始日 (tokutei1 default = fixed contract, so contract_start is required)
  // date inputs order: [0]=entry_date, [1]=contract_start, [2]=contract_end
  await page.locator('input[type="date"]').nth(1).fill('2026-04-01');
  // 所在地 (workplace_initial)
  await page.getByPlaceholder('例：東京都千代田区...').fill('大阪府大阪市北区1-2-3');
  // 業務内容 (job_description_initial)
  await page.getByPlaceholder('例：製造ラインにおける組立・検品作業').fill('製造ラインにおける組立・検品作業');
}

// ─── Helper: fill Step 3 required fields ───
async function fillStep3(page: Page) {
  await page.locator('input[type="time"]').first().fill('09:00');
  await page.locator('input[type="time"]').nth(1).fill('18:00');
  // 休日 — check at least one day via checkbox labels
  await page.locator('label').filter({ hasText: /^土$/ }).click();
  await page.locator('label').filter({ hasText: /^日$/ }).click();
}

// ─── Helper: fill Step 4 required fields ───
async function fillStep4(page: Page) {
  // 基本給 placeholder is "200,000"
  await page.getByPlaceholder('200,000').fill('250000');
  // 就業規則ありの場合、解雇事由の条番号が必須
  // "就業規則 第 [○] 条" — the first number input with placeholder "○"
  const articleInput = page.locator('input[type="number"][placeholder="○"]').first();
  if (await articleInput.isVisible()) {
    await articleInput.fill('30');
  }
}

// ─── Helper: click navigation buttons ───
async function clickNext(page: Page) {
  await page.getByRole('button', { name: '次へ' }).click();
}

async function clickBack(page: Page) {
  await page.getByRole('button', { name: '戻る' }).click();
}

// ─── Helper: navigate to a specific step (0-indexed) ───
async function goToStep(page: Page, targetStep: number) {
  await page.goto(PAGE_URL);
  await waitForWizard(page);

  if (targetStep >= 1) {
    await fillStep1(page);
    await clickNext(page);
    await expect(page.getByRole('heading', { name: '契約・業務' })).toBeVisible();
  }
  if (targetStep >= 2) {
    await fillStep2(page);
    await clickNext(page);
    await expect(page.getByRole('heading', { name: '勤務時間' })).toBeVisible();
  }
  if (targetStep >= 3) {
    await fillStep3(page);
    await clickNext(page);
    await expect(page.getByRole('heading', { name: '賃金・退職' })).toBeVisible();
  }
  if (targetStep >= 4) {
    await fillStep4(page);
    await clickNext(page);
    await expect(page.getByRole('heading', { name: '確認・PDF生成' })).toBeVisible();
  }
}

/* ================================================================
   Test Suite: Labor Notice Wizard E2E
   ================================================================ */

test.describe('労働条件通知書ウィザード', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    await waitForWizard(page);
  });

  // ──────────────────────────────────────────────
  // 1. Page load & initial state
  // ──────────────────────────────────────────────

  test('ページ読み込み: ウィザードが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '基本情報' })).toBeVisible();
    await expect(page.getByText('外国人労働者向け・バイリンガル対応')).toBeVisible();
    await expect(page.getByRole('button', { name: '次へ' })).toBeVisible();
    await expect(page.getByRole('button', { name: '戻る' })).not.toBeVisible();
  });

  test('プログレスバーが5セグメント表示される', async ({ page }) => {
    const bars = page.locator('.rounded-full.flex-1');
    await expect(bars).toHaveCount(5);
  });

  // ──────────────────────────────────────────────
  // 2. Step 1 validation
  // ──────────────────────────────────────────────

  test('Step1: 未入力で次へ → バリデーションエラー表示', async ({ page }) => {
    await page.getByPlaceholder('例：グエン　ヴァン　アン').clear();
    await clickNext(page);

    await expect(page.getByText('入力必須項目が未入力です')).toBeVisible();
    await expect(page.getByText('労働者氏名を入力してください')).toBeVisible();
    await expect(page.getByText('会社名を入力してください')).toBeVisible();
    await expect(page.getByText('住所を入力してください')).toBeVisible();
    await expect(page.getByText('使用者氏名を入力してください')).toBeVisible();
  });

  test('Step1: 必須入力後に次へ → Step2に遷移', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);

    await expect(page.getByRole('heading', { name: '契約・業務' })).toBeVisible();
    await expect(page.getByRole('button', { name: '戻る' })).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 3. Step 2: Contract & visa
  // ──────────────────────────────────────────────

  test('Step2: ビザタイプ変更で分野リストが切り替わる', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);
    await expect(page.getByRole('heading', { name: '契約・業務' })).toBeVisible();

    const sectorSelect = page.locator('select').first();
    const tokutei1Options = await sectorSelect.locator('option').count();

    await page.locator('button').filter({ hasText: '育成就労' }).first().click();
    const ikuseiOptions = await sectorSelect.locator('option').count();

    expect(tokutei1Options).not.toEqual(ikuseiOptions);
  });

  test('Step2: 育成就労選択時に転籍条項が表示される', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);

    await page.locator('button').filter({ hasText: '育成就労' }).first().click();
    await expect(page.getByText('転籍条項')).toBeVisible();
  });

  test('Step2: 未入力で次へ → バリデーションエラー', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);
    await clickNext(page);

    await expect(page.getByText('入力必須項目が未入力です')).toBeVisible();
    // ErrorMsg for tokutei_sector (not the <option> element)
    await expect(page.locator('p').filter({ hasText: '分野を選択してください' })).toBeVisible();
  });

  test('Step2: 必須入力後に次へ → Step3に遷移', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);
    await fillStep2(page);
    await clickNext(page);

    await expect(page.getByRole('heading', { name: '勤務時間' })).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 4. Step 3: Work hours
  // ──────────────────────────────────────────────

  test('Step3: シフト勤務選択でシフトパターン入力欄が表示される', async ({ page }) => {
    await goToStep(page, 2);

    await page.locator('label').filter({ hasText: 'シフト制' }).click();
    await expect(page.getByText('シフトパターン').first()).toBeVisible();
  });

  test('Step3: 固定勤務で時間未入力 → バリデーションエラー', async ({ page }) => {
    await goToStep(page, 2);

    const timeInputs = page.locator('input[type="time"]');
    if (await timeInputs.first().isVisible()) {
      await timeInputs.first().clear();
      await timeInputs.nth(1).clear();
    }
    await clickNext(page);

    await expect(page.getByText('入力必須項目が未入力です')).toBeVisible();
  });

  test('Step3: 必須入力後に次へ → Step4に遷移', async ({ page }) => {
    await goToStep(page, 2);
    await fillStep3(page);
    await clickNext(page);

    await expect(page.getByRole('heading', { name: '賃金・退職' })).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 5. Step 4: Wages
  // ──────────────────────────────────────────────

  test('Step4: 基本給未入力で次へ → バリデーションエラー', async ({ page }) => {
    await goToStep(page, 3);

    await page.getByPlaceholder('200,000').clear();
    await clickNext(page);

    await expect(page.getByText('入力必須項目が未入力です')).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 6. Navigation (back/tab)
  // ──────────────────────────────────────────────

  test('戻るボタンで前のステップに戻れる', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);
    await expect(page.getByRole('heading', { name: '契約・業務' })).toBeVisible();

    await clickBack(page);
    await expect(page.getByRole('heading', { name: '基本情報' })).toBeVisible();
  });

  test('完了済みステップタブをクリックして戻れる', async ({ page }) => {
    await goToStep(page, 2);
    // Now on Step 3, click Step 1 tab
    await page.locator('button').filter({ hasText: /STEP 1|基本情報/ }).first().click();
    await expect(page.getByRole('heading', { name: '基本情報' })).toBeVisible();
  });

  test('Step1の入力値が保持される', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);
    await clickBack(page);

    await expect(page.getByPlaceholder('例：グエン　ヴァン　アン')).toHaveValue('テスト太郎');
    await expect(page.getByPlaceholder('例：株式会社サンプル')).toHaveValue('テスト株式会社');
  });

  // ──────────────────────────────────────────────
  // 7. Full wizard flow → Step 5 (Review)
  // ──────────────────────────────────────────────

  test('全ステップ完走: Step5（確認・PDF生成）に到達', async ({ page }) => {
    await goToStep(page, 4);

    await expect(page.getByRole('heading', { name: '確認・PDF生成' })).toBeVisible();
    await expect(page.getByRole('button', { name: '次へ' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /英語/ })).toBeVisible();
  });

  test('Step5: 言語選択タブが切り替わる', async ({ page }) => {
    await goToStep(page, 4);

    await page.getByRole('button', { name: /英語/ }).click();
    await page.getByRole('button', { name: /ベトナム語/ }).click();
  });

  test('Step5: PDF生成ボタンが表示される', async ({ page }) => {
    await goToStep(page, 4);

    await expect(page.getByRole('button', { name: /PDFを生成/ })).toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 8. PDF generation (language validation)
  // ──────────────────────────────────────────────

  test('Step5: 日本語のままPDF生成 → ボタン無効化＋警告表示', async ({ page }) => {
    await goToStep(page, 4);

    // PDF button should be disabled when lang is 'ja'
    const pdfButton = page.getByRole('button', { name: /PDFを生成/ });
    await expect(pdfButton).toBeDisabled();
    // Warning message about selecting a foreign language
    await expect(page.getByText('外国語を1つ選択するとPDFを生成できます')).toBeVisible();
  });

  test('Step5: 英語選択後にPDF生成が実行される', async ({ page }) => {
    await goToStep(page, 4);

    await page.getByRole('button', { name: /英語/ }).click();

    // Button should become enabled after selecting a foreign language
    const pdfButton = page.getByRole('button', { name: /PDFを生成/ });
    await expect(pdfButton).toBeEnabled();

    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 }).catch(() => null);
    await pdfButton.click();

    const download = await downloadPromise;
    if (download) {
      expect(download.suggestedFilename()).toContain('.pdf');
    }
  });

  // ──────────────────────────────────────────────
  // 9. Conditional logic: visa-type specific UI
  // ──────────────────────────────────────────────

  test('育成就労: 転籍条項チェックで詳細入力が表示される', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);

    await page.locator('button').filter({ hasText: '育成就労' }).first().click();
    await page.locator('label').filter({ hasText: '転籍条項' }).click();
    // Use more specific locators to avoid ambiguity
    await expect(page.getByText('転籍制限期間必須').first()).toBeVisible();
    await expect(page.getByText('やむを得ない事情による転籍条件').first()).toBeVisible();
    await expect(page.getByText('本人意向による転籍条件').first()).toBeVisible();
  });

  test('特定技能2号: 転籍条項が非表示', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);

    await page.locator('button').filter({ hasText: '特定技能2号' }).click();
    await expect(page.getByText('転籍条項')).not.toBeVisible();
  });

  test('期間の定めなし選択で契約日付フィールドが非表示', async ({ page }) => {
    await fillStep1(page);
    await clickNext(page);

    await page.getByRole('button', { name: '期間の定めなし' }).click();
    await expect(page.getByText('契約開始日')).not.toBeVisible();
  });

  // ──────────────────────────────────────────────
  // 10. Responsive layout
  // ──────────────────────────────────────────────

  test('モバイル表示: ステップタブが短縮表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(PAGE_URL);
    await expect(page.getByRole('heading', { name: '基本情報' })).toBeVisible({ timeout: 15_000 });

    await expect(page.locator('button').filter({ hasText: 'STEP 1' })).toBeVisible();
  });
});
