import { Crown, ShieldCheck } from 'lucide-react'; //

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
                className="flex items-center justify-center bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-1.5 rounded-lg"
            >
                <Crown size={size} />
            </div>
        );
    }

    if (!isSuperAdmin && isAdmin) {
        return (
            <div
                title="Administrador"
                className="flex items-center justify-center bg-primary border border-primary text-text p-1.5 rounded-lg"
            >
                <ShieldCheck size={size} />
            </div>
        );
    }

    return null;
}
