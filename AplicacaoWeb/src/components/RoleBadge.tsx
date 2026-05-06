import { Crown, ShieldCheck } from 'lucide-react';

interface RoleBadgeProps {
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    size?: number;
}

export function RoleBadge({ isAdmin, isSuperAdmin, size = 16 }: RoleBadgeProps) {
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
            <div title="Administrador" className="flex items-center justify-center text-tretiary">
                <ShieldCheck className="w-[1rem] h-[1rem]" />
            </div>
        );
    }

    return null;
}
