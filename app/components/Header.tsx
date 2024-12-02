function Header() {
    return (
        <header className="bg-blue-600 text-white shadow">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <a href="/" className="text-lg font-bold">🚗 Car Inspection</a>
                <nav className="hidden md:flex space-x-6">
                    <a href="/" className="hover:text-gray-300">
                        Home
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        About
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        Services
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        Contact
                    </a>
                </nav>
            </div>
        </header>
    );
}

export default Header