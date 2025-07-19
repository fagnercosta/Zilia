# Guia de Internacionalização (i18n) - Zilia Smart Frontend

## Visão Geral

Este documento descreve a implementação de internacionalização no frontend do Zilia Smart usando `react-i18next`. O sistema suporta dois idiomas: Português (pt) e Inglês (en).

## Estrutura de Arquivos

### Configuração Principal
- `/src/lib/i18n.ts` - Configuração principal do i18next
- `/src/components/I18nLoader/index.tsx` - Componente que garante o carregamento das traduções
- `/src/components/LanguageSelector/index.tsx` - Seletor de idioma no header

### Arquivos de Tradução
```
/public/locales/
├── en/
│   ├── common.json      # Traduções compartilhadas
│   ├── dashboard.json   # Página principal/dashboard
│   ├── auth.json        # Autenticação e login
│   ├── stencil.json     # Medições de stencil
│   ├── automatic.json   # Medições automáticas
│   ├── configuration.json # Configurações e usuários
│   ├── reports.json     # Relatórios
│   └── users.json       # Gerenciamento de usuários
└── pt/
    └── [mesmos arquivos que en/]
```

## Padrões de Uso

### 1. Importação e Inicialização
```typescript
import { useTranslation } from 'react-i18next';

export function Component() {
  const { t } = useTranslation(['namespace1', 'namespace2']);
  // ...
}
```

### 2. Uso de Traduções
```typescript
// Formato correto com namespace
{t('namespace:key.subkey')}

// Exemplos:
{t('dashboard:search.title')}
{t('common:app.loading')}
{t('automatic:tension.measurementDate')}
```

### 3. Traduções com Parâmetros
```typescript
// No arquivo JSON:
"message": "Stencil {{partNumber}} não encontrado"

// No componente:
{t('dashboard:messages.stencilNotFound', { partNumber: stencil.part_number })}
```

## Namespaces Existentes

### common
Contém traduções gerais usadas em todo o aplicativo:
- Navegação do menu
- Botões comuns (Salvar, Cancelar, etc.)
- Mensagens de erro/sucesso genéricas
- Labels de paginação

### dashboard
Traduções da página principal:
- Cards de pesquisa e status
- Mensagens de busca de stencil
- Labels dos gráficos
- Botões de nova medição

### auth
Tela de login e autenticação:
- Labels de formulário
- Mensagens de erro de login
- Validações

### stencil
Páginas relacionadas a stencil:
- Listas de medições
- Medição manual
- Histórico de medições

### automatic
Medições automáticas:
- Medição de tensão automática
- Medição de arranhões automática
- Mensagens do robô

### configuration
Configurações e gerenciamento:
- Parâmetros do sistema
- Cadastro de usuários
- Configurações gerais

## Como Adicionar Novas Traduções

### 1. Adicionar no arquivo JSON
```json
// Em /public/locales/en/namespace.json
{
  "newSection": {
    "title": "New Title",
    "description": "New description"
  }
}

// Em /public/locales/pt/namespace.json
{
  "newSection": {
    "title": "Novo Título",
    "description": "Nova descrição"
  }
}
```

### 2. Usar no Componente
```typescript
const { t } = useTranslation('namespace');
// ...
<h1>{t('namespace:newSection.title')}</h1>
```

### 3. Para Novo Namespace
Se precisar criar um novo namespace:

1. Crie os arquivos JSON em ambos os idiomas
2. Importe no `/src/lib/i18n.ts`:
```typescript
import newNamespacePt from '../../public/locales/pt/newNamespace.json';
import newNamespaceEn from '../../public/locales/en/newNamespace.json';
```

3. Adicione aos resources:
```typescript
const resources = {
  pt: {
    // ...
    newNamespace: newNamespacePt,
  },
  en: {
    // ...
    newNamespace: newNamespaceEn,
  },
};
```

4. Adicione à lista de namespaces:
```typescript
ns: ['common', 'dashboard', /* ... */, 'newNamespace'],
```

## Componentes Especiais

### SelectHistory e SelectStencilItem
Estes componentes de seleção já estão internacionalizados:
- Placeholder de busca
- Mensagem de lista vazia
- Label padrão

## Checklist para Novos Componentes

- [ ] Importar `useTranslation`
- [ ] Definir namespaces necessários
- [ ] Substituir todos os textos hardcoded por `t('namespace:key')`
- [ ] Adicionar traduções em ambos os arquivos (pt/en)
- [ ] Testar alternância de idiomas
- [ ] Verificar se placeholders e mensagens de erro estão traduzidos

## Convenções

1. **Chaves em inglês**: Use chaves descritivas em inglês
   ```json
   "saveButton": "Salvar" // ✅
   "botaoSalvar": "Salvar" // ❌
   ```

2. **Estrutura hierárquica**: Organize por contexto
   ```json
   {
     "form": {
       "title": "Título",
       "fields": {
         "name": "Nome"
       }
     }
   }
   ```

3. **Reutilização**: Use o namespace `common` para traduções compartilhadas

## Troubleshooting

### Texto mostra a chave ao invés da tradução
- Verifique se está usando `:` entre namespace e chave
- Confirme que o namespace está importado em `i18n.ts`
- Verifique se a chave existe no arquivo JSON

### Componente não atualiza ao trocar idioma
- Certifique-se de que está usando o hook `useTranslation`
- Verifique se o componente está dentro do `I18nextProvider`

### Erro de namespace não encontrado
- Adicione o namespace na configuração do i18n
- Importe os arquivos JSON correspondentes

## Manutenção

Para encontrar textos não traduzidos:
1. Procure por strings hardcoded em português
2. Use a ferramenta de busca com regex: `"[À-ÿ\s]+"`
3. Verifique componentes de terceiros que podem ter labels próprios

## Observações Importantes

- O sistema usa detecção automática de idioma do navegador
- O idioma padrão é Português (pt)
- As traduções são carregadas de forma síncrona via imports diretos
- O componente `I18nLoader` garante que as traduções estejam prontas antes da renderização