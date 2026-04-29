export async function createManualService(formData: FormData) {
    return fetch('/api/manual', {
        method: 'POST',
        body: formData,
    });
}

export async function fetchUserManuals() {
    return fetch('/api/manual/me');
}

export async function getManualById(id: string) {
    return fetch(`/api/manual/${id}`);
}

export async function updateManualService(id: string, formData: FormData) {
    return fetch(`/api/manual/${id}`, {
        method: 'PUT',
        body: formData,
    });
}

export const deleteManualService = async (editId: string) => {
    const response = await fetch(`/api/manual/${editId}`, { method: 'DELETE' });
    if (!response.ok) {
        throw new Error('Erro ao excluir manual');
    }
    return response.json();
};
