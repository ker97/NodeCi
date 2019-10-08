const sessionFactory = require('./factories/sessionFactory.js');
const userFactory = require('./factories/userFactory.js');
const Page = require('./helpers/page.js');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://ocalhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('Checks header title', async () => {
  const text = await page.getContentsOf('a.brand-logo');
  expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('Logout button appears after logging in', async () => {
  await page.login(); 
  const logoutButton = await page.$eval("a[href='/auth/logout']", (el) => el.innerHTML);
  
  expect(logoutButton).toEqual('Logout');
});


