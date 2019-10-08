Number.prototype._called = {};

const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });
  
  describe('and using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'Sample Blog Title'); 
      await page.type('.content input', 'Sample text'); 
      await page.click('form button');
    }); 
    test('should display review screen', async () => {
      const formTitle = await page.getContentsOf('form h5'); 
      expect(formTitle).toEqual('Please confirm your entries');
    });
    test('should dislpay index page after saving a blog', async () => {
      await page.click('button.green');
      await page.waitFor('.card');
      const cardTitle = await page.getContentsOf('.card-title'); 
      const cardContent = await page.getContentsOf('p'); 
      expect(cardTitle).toEqual('Sample Blog Title');
      expect(cardContent).toEqual('Sample text');
    });
  });

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    }); 
    test('the form shows error messages', async () => {
      const titleError = await page.getContentsOf('.title .red-text'); 
      const contentError = await page.getContentsOf('.content .red-text'); 
      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('When not logged in', async () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T', 
        content: 'C'
      }
    }
  ];
  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions); 
    for (i=0; i<results.length; i++) {
      expect(results[i]).toEqual({error: 'You must log in!'}); 
    }
  });
});
