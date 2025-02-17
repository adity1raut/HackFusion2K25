import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AuthService from "../../utils/AuthService";
import logo from "../../assets/logo.jpg"

const Navbar = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState("/");

    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location]);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleNavigation = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        navigate("/login");
        window.dispatchEvent(new Event("authChange"));
    };

    const NavButton = ({ path, children, className = "", isLogout = false }) => {
        const isActive = activeRoute === path;
        const baseClasses = "font-medium transition-all duration-300 relative";
        const defaultClasses = `${baseClasses} ${className} ${isActive
                ? "text-blue-600"
                : isLogout
                    ? "text-red-500 hover:text-red-700"
                    : "text-gray-700 hover:text-blue-500"
            }`;

        return (
            <button
                onClick={() => isLogout ? handleLogout() : handleNavigation(path)}
                className={`${defaultClasses} group`}
            >
                {children}
                {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-green-500 transform scale-x-100 transition-transform duration-300" />
                )}
                {!isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                )}
            </button>
        );
    };

    return (
        <div className="fixed top-0 z-50 min-w-full bg-gradient-to-r from-cyan-500/10 to-green-500/10 backdrop-blur-sm shadow-lg">
            <nav className="container mx-auto flex justify-between items-center p-4">

                <div className="flex items-center">
                    <button
                        onClick={() => handleNavigation("/")}
                        className="transform transition-transform duration-300 hover:scale-110"
                    >
                        <img src={logo} alt="Logo" className="h-12" />
                    </button>
                </div>

                <ul className="hidden md:flex space-x-6 items-center">


                    {!isAuthenticated ? (
                        <>
                            <li>
                                <NavButton path="/">DashBoard</NavButton>
                            </li>
                            <li><NavButton path="/login">LOGIN</NavButton></li>
                            <li><NavButton path="/signup">SIGNUP</NavButton></li>
                            <li><NavButton path="/forgot-password">FORGOT PASSWORD</NavButton></li>
                        </>
                    ) : (
                        <>
                            <li><NavButton path="/dashboard">HOME</NavButton></li>
                            <li><NavButton path="/profile">PROFILE</NavButton></li>
                            <li><NavButton path="/election">Election</NavButton></li>
                            <li><NavButton path="/booking">Booking</NavButton></li>
                            <li><NavButton path="/logout" isLogout={true}>LOGOUT</NavButton></li>
                        </>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-700 focus:outline-none transform transition-transform duration-300 hover:scale-110"
                    onClick={toggleMenu}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>


                <div
                    className={`${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                        } md:hidden absolute top-16 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg p-4 transition-all duration-300`}
                >
                    <ul className="space-y-4">
                        {!isAuthenticated ? (
                            <>
                                <li><NavButton path="/">HOME</NavButton></li>
                                <li><NavButton path="/login">LOGIN</NavButton></li>
                                <li><NavButton path="/signup">SIGNUP</NavButton></li>
                                <li><NavButton path="/forgot-password">FORGOT PASSWORD</NavButton></li>
                            </>
                        ) : (
                            <>
                                <li><NavButton path="/dashboard">HOME</NavButton></li>
                                <li><NavButton path="/profile">PROFILE</NavButton></li>
                                <li><NavButton path="/election">Election</NavButton></li>
                                <li><NavButton path="/booking">Booking</NavButton></li>
                                <li><NavButton path="/logout" isLogout={true}>LOGOUT</NavButton></li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;