
import { test, expect } from '@playwright/test';

test.describe('Área Administrativa', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin-auth');
  });

  test('deve realizar login como admin e acessar o dashboard', async ({ page }) => {
    // Preenche formulário de login
    await page.fill('[name="email"]', 'admin@teste.com');
    await page.fill('[name="password"]', 'senha123');
    await page.click('button[type="submit"]');

    // Verifica redirecionamento para o dashboard
    await expect(page).toHaveURL('/manager-admin');
    await expect(page.getByText('Bem-vindo')).toBeVisible();

    // Verifica cards principais
    const cards = [
      'Agendamentos',
      'Time',
      'Serviços',
      'Analytics',
      'Clientes',
      'Configurações'
    ];
    
    for (const card of cards) {
      await expect(page.getByText(card)).toBeVisible();
    }
  });

  test('deve mostrar erro ao tentar login com credenciais inválidas', async ({ page }) => {
    await page.fill('[name="email"]', 'invalido@teste.com');
    await page.fill('[name="password"]', 'senhaerrada');
    await page.click('button[type="submit"]');

    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible();
  });

  test('deve navegar entre as seções do dashboard', async ({ page }) => {
    // Login
    await page.fill('[name="email"]', 'admin@teste.com');
    await page.fill('[name="password"]', 'senha123');
    await page.click('button[type="submit"]');

    // Navega para Serviços
    await page.click('text=Serviços');
    await expect(page).toHaveURL('/manager-admin/servicos');
    await expect(page.getByText('Gerenciar Serviços')).toBeVisible();

    // Navega para Time
    await page.click('text=Time');
    await expect(page).toHaveURL('/manager-admin/time');
    await expect(page.getByText('Gerenciar Time')).toBeVisible();
  });
});
