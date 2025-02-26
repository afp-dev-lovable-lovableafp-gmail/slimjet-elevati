
import { test, expect } from '@playwright/test';

test.describe('Gerenciamento de Perfil', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/auth');
    await page.getByPlaceholder('E-mail').fill('user@example.com');
    await page.getByPlaceholder('Senha').fill('password123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('deve atualizar informações do perfil', async ({ page }) => {
    // Navegar para página de perfil
    await page.goto('/profile');
    
    // Atualizar informações
    await page.getByLabel('Nome completo').fill('Nome Atualizado');
    await page.getByLabel('Empresa').fill('Empresa Teste');
    await page.getByLabel('Telefone').fill('(11)88888-8888');
    
    // Salvar alterações
    await page.getByRole('button', { name: 'Salvar alterações' }).click();
    
    // Verificar mensagem de sucesso
    await expect(page.getByText('Perfil atualizado com sucesso!')).toBeVisible();
    
    // Recarregar página e verificar se as alterações persistiram
    await page.reload();
    await expect(page.getByLabel('Nome completo')).toHaveValue('Nome Atualizado');
    await expect(page.getByLabel('Empresa')).toHaveValue('Empresa Teste');
    await expect(page.getByLabel('Telefone')).toHaveValue('(11)88888-8888');
  });

  test('deve alterar senha com sucesso', async ({ page }) => {
    await page.goto('/profile');
    
    // Abrir modal de alteração de senha
    await page.getByRole('button', { name: 'Alterar senha' }).click();
    
    // Preencher formulário
    await page.getByLabel('Senha atual').fill('password123');
    await page.getByLabel('Nova senha').fill('newPassword123!');
    await page.getByLabel('Confirmar nova senha').fill('newPassword123!');
    
    // Confirmar alteração
    await page.getByRole('button', { name: 'Confirmar' }).click();
    
    // Verificar mensagem de sucesso
    await expect(page.getByText('Senha alterada com sucesso!')).toBeVisible();
  });
});
