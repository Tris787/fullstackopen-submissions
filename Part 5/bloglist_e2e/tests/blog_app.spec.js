const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, createUser } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await createUser(request, 'Tom', 'Tris', '123')

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const usernameInput = await page.getByTestId('username')
    const passwordInput = await page.getByTestId('password')
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'Tris', '123')      
      await expect(page.getByText('Tom logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Tris', '1')
      await expect(page.getByText('Invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in with zero blogs', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, 'Tris', '123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testblog', 'Testauthor', 'www.test.de')
      await expect(page.getByText('a new blog Testblog by Testauthor added')).toBeVisible()
      await expect(page.getByText('Testblog Testauthorshow')).toBeVisible()      
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Testblog', 'Testauthor', 'www.test.de')
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1like')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('2like')).toBeVisible()
    })

    test('the user who created the blog can delete it', async ({ page }) => {
      await createBlog(page, 'Testblog', 'Testauthor', 'www.test.de')
      await page.getByRole('button', { name: 'show' }).click()
      await page.pause()
      page.once('dialog', async (dialog) => {        
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText('0like')).not.toBeVisible()
    })

  })

  describe('When logged in with blogs from different user', () => {
    beforeEach(async ({ page, request }) => {
      await createUser(request, 'Maja', 'Biene', '987')
      await loginWith(page, 'Biene', '987')
      await createBlog(page, 'Bienenblog', 'Bineneauthor', 'www.biene.de')
      await page.getByRole('button', { name: 'logout' }).click()
    })

    test('a stranger blog cannot be deleted', async ({ page }) => {      
      await loginWith(page, 'Tris', '123')
      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })

    test('the blog with the most likes is at the top', async ({ page }) => {
      await loginWith(page, 'Tris', '123')
      await createBlog(page, 'Testblog', 'Testauthor', 'www.test.de')
      await expect(page.getByText('Testblog Testauthorshow')).toBeVisible() 
      await page.getByRole('button', { name: 'show' }).first().click()
      await page.getByRole('button', { name: 'show' }).click()

      const firstBlogBeforeLikes = page.getByTestId('bloglist').locator('div').first() 
      const firstBlogTextBefore = await firstBlogBeforeLikes.textContent()
      console.log(firstBlogTextBefore)
      expect(firstBlogTextBefore).toContain('Bienenblog')      

      await page.locator('div').filter({ hasText: /^www\.biene\.de0likeMaja$/ }).getByRole('button').click()
      await page.waitForTimeout(200)

      await page.getByRole('button', { name: 'like' }).nth(1).click()
      await page.waitForTimeout(200)

      await page.getByRole('button', { name: 'like' }).nth(1).click()
      await page.waitForTimeout(200)

      const firstBlogAfterLikes = page.getByTestId('bloglist').locator('div').first() 
      const firstBlogTextAfter = await firstBlogAfterLikes.textContent()
      console.log(firstBlogTextAfter)
      expect(firstBlogTextAfter).toContain('Testblog')      
    })
  })
})