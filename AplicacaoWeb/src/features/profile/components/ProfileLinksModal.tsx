import React, { useEffect } from 'react';
import { X, Link2, Globe, ExternalLink, Mail } from 'lucide-react';
// Importando as marcas do FontAwesome 6 (fa6)
import {
    FaInstagram,
    FaGithub,
    FaLinkedin,
    FaYoutube,
    FaXTwitter,
    FaTwitch,
    FaFacebook,
    FaTiktok,
    FaDiscord,
    FaWhatsapp,
    FaGitlab,
} from 'react-icons/fa6';

interface ProfileLinksModalProps {
    links: { name: string; url: string }[];
    onClose: () => void;
}

export function ProfileLinksModal({ links, onClose }: ProfileLinksModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!links || links.length === 0) return null;

    const getLinkIcon = (url: string, name: string) => {
        const str = (url + name).toLowerCase();

        if (str.includes('instagram')) {
            return <FaInstagram className="w-6 h-6 text-text" />;
        }
        if (str.includes('github')) {
            return <FaGithub className="w-6 h-6 text-text" />;
        }
        if (str.includes('gitlab')) {
            return <FaGitlab className="w-6 h-6 text-text" />;
        }
        if (str.includes('linkedin')) {
            return <FaLinkedin className="w-6 h-6 text-text" />;
        }
        if (str.includes('youtube')) {
            return <FaYoutube className="w-6 h-6 text-text" />;
        }
        if (str.includes('twitter') || str.includes('x.com')) {
            return <FaXTwitter className="w-6 h-6 text-text" />;
        }
        if (str.includes('twitch')) {
            return <FaTwitch className="w-6 h-6 text-text" />;
        }
        if (str.includes('facebook')) {
            return <FaFacebook className="w-6 h-6 text-text" />;
        }
        if (str.includes('tiktok')) {
            return <FaTiktok className="w-6 h-6 text-text" />;
        }
        if (str.includes('discord')) {
            return <FaDiscord className="w-6 h-6 text-text" />;
        }
        if (str.includes('whatsapp')) {
            return <FaWhatsapp className="w-6 h-6 text-text" />;
        }
        if (str.includes('mail') || str.includes('@')) {
            return <Mail className="w-6 h-6 text-text" />;
        }

        return <Globe className="w-6 h-6 text-text" />;
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-card border border-card-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-sub-text hover:text-text p-1.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                    aria-label="Fechar"
                >
                    <X className="w-[1.25rem] h-[1.25rem]" />
                </button>

                <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                    <Link2 className="w-[1.5rem] h-[1.5rem] text-primary" />
                    Links:
                </h2>

                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {links.map((link, index) => {
                        const href = link.url.startsWith('http') ? link.url : `https://${link.url}`;

                        return (
                            <a
                                key={index}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-3 rounded-xl bg-background border border-card-border hover:bg-gray transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 border-card-border bg-card group-hover:border-primary transition-colors">
                                    {getLinkIcon(link.url, link.name)}
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <span className="text-text font-bold text-sm truncate">
                                        {link.name}
                                    </span>
                                    <span className="text-sub-text text-xs truncate">
                                        {link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                    </span>
                                </div>
                                <ExternalLink className="w-5 h-5 text-sub-text shrink-0" />
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
