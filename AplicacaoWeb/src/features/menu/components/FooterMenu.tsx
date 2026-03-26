export function FooterMenu({ isOpen }: { isOpen: boolean }) {
    return (
        <div
            className={`flex items-center justify-center mt-auto transition-all duration-300 overflow-hidden
                ${isOpen ? 'p-6 opacity-100 flex' : 'p-4 opacity-0 hidden lg:opacity-100 lg:flex lg:p-6'}`}
        >
            <h1 className="text-xl font-bold whitespace-nowrap">Manuario</h1>
        </div>
    );
}
