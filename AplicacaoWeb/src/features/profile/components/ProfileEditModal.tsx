import React, { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { CustomInput } from '@/src/components/CustomInput';

interface ProfileLink {
    name: string;
    url: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    formData: {
        name: string;
        email: string;
        password?: string;
        bio: string;
        links: ProfileLink[];
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSave: () => void;
    onDelete: () => void;
    isLoading: boolean;
    addLink: () => void;
    updateLink: (index: number, field: 'name' | 'url', value: string) => void;
    removeLink: (index: number) => void;
}

export const ProfileEditModal: React.FC<Props> = ({
    isOpen,
    onClose,
    formData,
    onChange,
    onSave,
    onDelete,
    isLoading,
    addLink,
    updateLink,
    removeLink,
}) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative bg-card border border-card-border rounded-2xl w-full max-w-[38rem] shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-sub-text hover:text-text transition cursor-pointer p-2 rounded-full hover:bg-white/5"
                    aria-label="Fechar"
                >
                    <X size={24} />
                </button>

                <div className="mb-8 pr-6">
                    <h2 className="text-2xl font-bold text-text">Editar Perfil</h2>
                    <p className="text-sm text-sub-text mt-2">
                        Gerencie suas informações pessoais e configurações da conta.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <CustomInput
                        id="name"
                        label="Nome"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                    />

                    <CustomInput
                        id="email"
                        label="E-mail"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                    />

                    <CustomInput
                        id="password"
                        label="Nova Senha"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        placeholder="Deixe em branco para não alterar"
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-sub-text text-sm font-semibold" htmlFor="bio">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={onChange}
                            maxLength={150}
                            rows={3}
                            placeholder="Fale um pouco sobre você..."
                            className="w-full bg-card text-text border border-card-border p-3 rounded-xl focus:outline-none focus:border-primary transition resize-none"
                        />
                        <span className="text-sub-text text-xs text-right">
                            {formData.bio.length}/150
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sub-text text-sm font-semibold">Links</label>

                        <div className="flex flex-col gap-3">
                            {formData.links.map((link, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2 p-3 bg-card-border/30 border border-card-border rounded-xl relative"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-sub-text uppercase tracking-wider font-bold">
                                            Link {index + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition cursor-pointer"
                                            aria-label="Remover link"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <input
                                        className="bg-card text-text border border-card-border p-3 rounded-xl w-full focus:outline-none focus:border-primary transition"
                                        placeholder="Nome (Ex: Instagram)"
                                        value={link.name}
                                        onChange={(e) => updateLink(index, 'name', e.target.value)}
                                    />
                                    <input
                                        className="bg-card text-text border border-card-border p-3 rounded-xl w-full focus:outline-none focus:border-primary transition"
                                        placeholder="https://..."
                                        value={link.url}
                                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addLink}
                            className="bg-primary text-white hover:bg-primary-hover px-5 py-2.5 rounded-xl text-sm font-bold self-start transition cursor-pointer"
                        >
                            + Adicionar Link
                        </button>
                    </div>

                    <div className="flex flex-col mt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-text font-bold text-base py-3 rounded-xl hover:bg-primary-hover transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>

                        <div className="w-full h-px bg-card-border my-4"></div>

                        <button
                            type="button"
                            onClick={onDelete}
                            className="w-full flex items-center justify-center gap-2 border border-red-900/40 text-red-500 font-bold text-base py-3 rounded-xl hover:bg-red-900/20 transition cursor-pointer"
                        >
                            <Trash2 size={20} /> Excluir conta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
