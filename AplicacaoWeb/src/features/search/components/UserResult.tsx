import Link from 'next/link';

export default function UserResult({ user }: { user: any }) {
    const avatarUrl = user.img
        ? `/upload/${user.idPublic}/user/${user.img}`
        : '/img/iconePadrao.jpg';

    return (
        <Link
            href={`/perfil/${user.idPublic}`}
            className="bg-card border border-card-border rounded-2xl p-4 flex items-center gap-4 mb-3 hover:bg-gray transition-colors"
        >
            <img
                src={avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border border-card-border"
            />
            <h3 className="text-text font-bold">{user.name}</h3>
        </Link>
    );
}
