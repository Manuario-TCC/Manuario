export const createService = {
    async postRule(data: any) {
        return console.log('Enviando Regra:', data);
    },

    async postQuestion(data: any) {
        return console.log('Enviando Dúvida:', data);
    },

    async postManual(data: any) {
        return console.log('Enviando Manual:', data);
    },
};
