import { Link } from 'react-router-dom';

const Header = () => {
    const user = null;
    
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        Bosta Store
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            to="/create-product"
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Create Product
                        </Link>
                        <Link
                            to="/cart"
                            className="text-gray-700 hover:text-blue-600 transition-colors relative"
                        >
                            Cart
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-700">Hello, {user.name}</span>
                                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
