import { Crown, ShieldCheck, Bot } from 'lucide-react';

interface RoleBadgeProps {
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    isBot?: boolean;
    size?: number;
}

export function RoleBadge({ isAdmin, isSuperAdmin, isBot }: RoleBadgeProps) {
    if (isBot) {
        return (
            <div
                title="Conta Oficial (Bot)"
                className="flex items-center justify-center text-primary"
            >
                <Bot className="w-[1.4rem] h-[1.4rem]" />
            </div>
        );
    }

    if (isSuperAdmin) {
        return (
            <div
                title="Super Administrador"
                className="flex items-center justify-center text-yellow-500"
            >
                <Crown className="w-[1rem] h-[1rem]" />
            </div>
        );
    }

    if (!isSuperAdmin && isAdmin) {
        return (
            <div title="Administrador" className="flex items-center justify-center text-primary">
                <ShieldCheck className="w-[1rem] h-[1rem]" />
            </div>
        );
    }

    return null;
}
