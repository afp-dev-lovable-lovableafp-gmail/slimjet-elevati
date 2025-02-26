
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação', () => {
  const TEST_USER = {
    email: `test-${Date.now()}@example.com`,
    password: 'testPassword123!',
    fullName: 'Usuário Teste',
    phone: '(11)99999-9999'
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('deve realizar cadastro com sucesso', async ({ page }) => {
    // Clicar no botão de cadastro
    await page.getByText('Não tem uma conta? Cadastre-se').click();
    
    // Preencher formulário de cadastro
    await page.getByPlaceholder('E-mail').fill(TEST_USER.email);
    await page.getByPlaceholder('Senha').fill(TEST_USER.password);
    await page.getByPlaceholder('Nome completo').fill(TEST_USER.fullName);
    await page.getByPlaceholder('Telefone').fill(TEST_USER.phone);
    
    // Enviar formulário
    await page.getByRole('button', { name: 'Criar conta' }).click();
    
    // Verificar mensagem de sucesso
    await expect(page.getByText('Cadastro realizado com sucesso!')).toBeVisible();
  });

  test('deve realizar login com sucesso', async ({ page }) => {
    // Preencher formulário de login
    await page.getByPlaceholder('E-mail').fill(TEST_USER.email);
    await page.getByPlaceholder('Senha').fill(TEST_USER.password);
    
    // Enviar formulário
    await page.getByRole('button', { name: 'Entrar' }).click();
    
    // Verificar redirecionamento para dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
