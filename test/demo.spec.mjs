import { test, expect } from '@playwright/test';
test.beforeEach(async ({page}) => {
  page.__errors=[]; page.on('pageerror',error => page.__errors.push(error.message));
  await page.goto('/demo/dist/');
  await expect(page.getByText('Sample loaded locally · no network data requests',{exact:true})).toBeVisible();
});
test.afterEach(async ({page}) => { expect(page.__errors).toEqual([]); });

test('ranges, metric selection, table and keyboard inspection use the current sample', async ({page}) => {
  await page.getByRole('button',{name:'7 days',exact:true}).click();
  await expect(page.getByText('Sample loaded locally · no network data requests',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:/Daily movement/}).click();
  await expect(page.getByRole('img',{name:/Daily movement over 7 days/})).toBeVisible();
  await page.getByRole('button',{name:'View data table'}).click();
  await expect(page.locator('tbody tr')).toHaveCount(7);
  const slider = page.getByRole('slider',{name:'Inspect a day'});
  await slider.focus(); await page.keyboard.press('Home');
  await expect(slider).toHaveAttribute('aria-valuetext',/Oct 9:/);
  await page.keyboard.press('End'); await expect(slider).toHaveAttribute('aria-valuetext',/Oct 15:/);
  await page.getByRole('button',{name:'60 days',exact:true}).click();
  await expect(page.locator('tbody tr')).toHaveCount(60);
});
test('a failed endpoint leaves successful metrics usable and retry restores it', async ({page}) => {
  await page.getByRole('button',{name:/Simulate a sync issue/}).click();
  await expect(page.getByRole('heading',{name:'Readiness is taking a moment.'})).toBeVisible();
  await expect(page.getByText('1 collection unavailable · other results preserved',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:/Sleep score/}).click();
  await expect(page.getByRole('img',{name:/Sleep score over 30 days/})).toBeVisible();
  await page.getByRole('button',{name:/Readiness.*Collection unavailable/}).click();
  await page.getByRole('button',{name:'Restore collection',exact:true}).click();
  await expect(page.getByRole('img',{name:/Readiness over 30 days/})).toBeVisible();
  await expect(page.getByText('Sample loaded locally · no network data requests',{exact:true})).toBeVisible();
});
test('missing observations are disclosed and CSV includes only generated sample data', async ({page}) => {
  await page.getByRole('button',{name:'View data table'}).click();
  expect(await page.getByRole('cell',{name:'Missing observation',exact:true}).count()).toBe(2);
  const download = page.waitForEvent('download');
  await page.getByRole('button',{name:/Export sample CSV/}).click();
  expect((await download).suggestedFilename()).toBe('oura-fictional-sample.csv');
});
test('all data is local and the theme can be changed without new requests', async ({page}) => {
  const external=[]; page.on('request',request => {if(!request.url().startsWith('http://127.0.0.1:4175/'))external.push(request.url());});
  await page.reload();
  await expect(page.getByText('Sample loaded locally · no network data requests',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Switch to dark theme'}).click();
  await expect(page.locator('.app')).toHaveClass(/dark/);
  await expect(page.locator('.app')).toHaveCSS('background-color','rgb(20, 36, 33)');
  await expect(page.locator('.app')).toHaveCSS('color','rgb(223, 235, 230)');
  await page.getByRole('button',{name:'Switch to light theme'}).click();
  expect(external).toEqual([]);
});
for(const width of [320,390,768,1440]) test(`gallery fits ${width}px in both themes`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Switch to dark theme'}).click();
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
