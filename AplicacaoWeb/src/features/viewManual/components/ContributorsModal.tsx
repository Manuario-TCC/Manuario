'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, X } from 'lucide-react';

interface Contributor {
    idPublico: string;
    name: string;
    img?: string;
}

interface ContributorsModalProps {
    isOpen: boolean;
    onClose: () => void;
    contributors: Contributor[];
}

export function ContributorsModal({ isOpen, onClose, contributors }: ContributorsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-card rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-sub-text hover:text-white p-1.5 rounded-lg cursor-pointer"
                >
                    <X className="w-[1.25rem] h-[1.25rem]" />
                </button>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-[1.5rem] h-[1.5rem]" />
                    Contribuidores
                </h2>

                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {contributors.map((user) => {
                        const avatarImg = user.img
                            ? `/upload/${user.idPublico}/user/${user.img}`
                            : '/img/iconePadrao.jpg';

                        return (
                            <Link
                                key={user.idPublico}
                                href={`/perfil/${user.idPublico}`}
                                className="flex items-center gap-4 p-3 rounded-xl bg-background hover:bg-gray"
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden relative bg-gray shrink-0 border-2 border-gray">
                                    <Image
                                        src={avatarImg}
                                        alt={user.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-text font-bold text-sm">{user.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
