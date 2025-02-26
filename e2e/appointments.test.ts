
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Agendamento', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/auth');
    await page.getByPlaceholder('E-mail').fill('user@example.com');
    await page.getByPlaceholder('Senha').fill('password123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('deve criar um agendamento com sucesso', async ({ page }) => {
    // Navegar para página de agendamento
    await page.goto('/booking');
    
    // Selecionar serviço
    await page.getByRole('combobox').click();
    await page.getByText('Consultoria').click();
    
    // Selecionar data
    await page.getByRole('button', { name: /Selecione uma data/ }).click();
    await page.getByRole('button', { name: new RegExp(String(new Date().getDate() + 1)) }).click();
    
    // Selecionar horário
    await page.getByRole('combobox').nth(1).click();
    await page.getByText('14:00').click();
    
    // Adicionar observações
    await page.getByPlaceholder('Adicione informações importantes aqui').fill('Teste de agendamento automatizado');
    
    // Confirmar agendamento
    await page.getByRole('button', { name: 'Agendar' }).click();
    
    // Verificar redirecionamento e mensagem de sucesso
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Agendamento realizado com sucesso!')).toBeVisible();
  });
});
