@AGENTS.md

# Diretrizes e Padrões do Projeto

Este é um codigo utiliza a arquitetura baseada em features (Feature-Sliced Design adaptado).

## Stack Tecnológica

- Next.js (App Router)
- TypeScript
- Tailwind CSS & Shadcn UI
- Prisma (ORM) & MongoDB & Neo4j
- n8n (Microsserviço de IA e orquestração)
- Docker & RabbitMQ

## Arquitetura de Pastas (Features)

Todo o código relacionado a um domínio específico da aplicação deve ser encapsulado dentro de `src/features/<nome-da-feature>/`.

Cada feature deve seguir estritamente a estrutura abaixo:

- `/components`: Apenas componentes visuais (UI) específicos desta feature.
- `/hooks`: Custom hooks contendo regras de negócio e gerenciamento de estado local.
- `/services`: Isolamento de chamadas de API externa (fetch/axios). Os hooks devem consumir estes serviços, e nunca fazer a chamada de rede diretamente.

## Arquitetura Global

- `src/components/`: Componentes visuais genéricos e reutilizáveis (ex: botões, modais, componentes do Shadcn).
- `src/hooks/`: Hooks globais (ex: `useAuth`, `useTheme`).
- `src/services/`: Serviços globais ou instâncias configuradas (ex: cliente Axios genérico, conexão com n8n).
- `app/`: Exclusivo para o roteamento do Next.js e layouts.

### 🎨 Padrão de Estilização (Tailwind CSS)

- **Uso Obrigatório de Variáveis:** SEMPRE utilize as variáveis semânticas de cor definidas no `@theme` do `app/globals.css` (exemplo: `bg-primary`, `text-text`, `border-card-border`).
- **Proibido Hexadecimal Fixo:** É ESTRITAMENTE PROIBIDO o uso de valores hexadecimais _hardcoded_ nas classes do Tailwind (exemplo: NUNCA use `bg-[#8b5cf6]`, `text-[#13111c]`).
- **Nova Cor:** Se o design exigir uma cor que não existe, ela DEVE ser criada primeiro como uma nova variável no `globals.css`.
