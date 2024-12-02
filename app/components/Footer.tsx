function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300">
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h4 className="text-white font-bold mb-2">Car Inspection</h4>
                    <p>Making your car inspections easier and faster.</p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-2">Quick Links</h4>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="hover:text-white">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-2">Contact Us</h4>
                    <p>Email: quachhuycm@gmail.com</p>
                    <p>Phone: +84 941 499 757</p>
                    <p>Address: Di An, Thu Duc City</p>
                </div>
            </div>
            <div className="bg-gray-900 text-gray-500 text-center py-4">
                &copy; {new Date().getFullYear()} Car Inspection. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer