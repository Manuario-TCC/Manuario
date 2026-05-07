interface AskAssistantPayload {
    message: string;
}

export const assistantService = {
    async askIA({ message }: AskAssistantPayload): Promise<string> {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return `Olá! Recebi sua mensagem: *"${message}"*.\n\nSou o assistente inteligente e estou aqui para tirar dúvidas sobre regras de jogos. Aqui está um exemplo de **Markdown** com uma lista:\n- Pular a vez\n- Comprar duas cartas\n\nComo posso te ajudar mais hoje?`;
    },
};
