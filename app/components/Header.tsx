import Link from 'next/link';

function Header() {
    return (
        <header className="bg-blue-600 text-white shadow">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/cars" className="text-lg font-bold">🚗 Car Inspection</Link>
                <nav className="hidden md:flex space-x-6">
                    <Link href="/cars" className="hover:text-gray-300">
                        Home
                    </Link>
                    <Link href="#" className="hover:text-gray-300">
                        About
                    </Link>
                    <Link href="#" className="hover:text-gray-300">
                        Services
                    </Link>
                    <Link href="#" className="hover:text-gray-300">
                        Contact
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
