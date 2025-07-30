import React, { useState, useRef, useEffect } from 'react';
import { logoutUser } from "../api/auth";
import pic from "../assets/default-profile.jpg"
import { useNavigate } from 'react-router-dom';

interface NormalHeaderProps {
  page_name?: string;
}

const NormalHeader: React.FC<NormalHeaderProps> = ({ page_name = "Dashboard" }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const base_endpoint = "http://localhost:8000"

    const [name, setName] = useState("");
    const [picture, setPicture] = useState(null)
    const [email, setEmail] = useState("")

     const navigate = useNavigate()

    useEffect(() => {
        const user = localStorage.getItem('user')
        if(user)
        {
            const parsedData = JSON.parse(user);
            setName(parsedData.first_name+" "+parsedData.last_name);
            setEmail(parsedData.email);
            setPicture(parsedData.profile_picture);
        }
        else
        {
            navigate("/login")
        }
    })

    const handleLogout = () => {
        logoutUser()
    }

    const profile_picture = pic;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close dropdown on escape key
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleMenuItemClick = (action?: () => void) => {
        setIsDropdownOpen(false);
        if (action) {
            action();
        }
    };

    return (
        <>
            <div className="flex h-20 justify-between items-center bg-gradient-to-r from-neutral-200 to-blue-200">
                <h2 className="text-2xl ml-5 text-orange-500 font-medium cursor-pointer">
                    <a href="/">
                        <span className="text-blue-600 font-black text-3xl">Cg</span> Events
                    </a>
                </h2>
                <h2 className='text-orange-400 font-bold text-3xl'>{page_name}</h2>
                <div className="mr-7 flex gap-12 items-center">
                    <div className="flex gap-5">
                        <a href='/events' className="cursor-pointer text-blue-600 hover:text-blue-800 shadow-2xs hover:shadow-lg shadow-blue-400 transition-all duration-200">Upcoming Events</a>
                        <a href='/events/past' className="cursor-pointer text-blue-600 hover:text-blue-800 shadow-2xs hover:shadow-lg shadow-blue-400 transition-all duration-200">Past Events</a>
                        <a href='/booking' className="cursor-pointer text-blue-600 hover:text-blue-800 shadow-2xs hover:shadow-lg shadow-blue-400 transition-all duration-200">My Bookings</a>
                        <a href='/recommend' className="cursor-pointer text-blue-600 hover:text-blue-800 shadow-2xs hover:shadow-lg shadow-blue-400 transition-all duration-200">Recommendations</a>
                    </div>
                    
                    {/* User Dropdown */}
                    <div className="relative">
                        <button 
                            ref={buttonRef}
                            onClick={toggleDropdown}
                            className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white cursor-pointer transition-colors duration-200" 
                            type="button"
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="true"
                        >
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 me-2 rounded-full object-cover" src={picture? base_endpoint+picture : profile_picture} alt="user photo" />
                            {name}
                            <svg 
                                className={`w-2.5 h-2.5 ms-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 10 6"
                            >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        <div 
                            ref={dropdownRef}
                            className={`absolute right-0 z-50 mt-2 w-54 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600 transition-all duration-200 origin-top-right ${
                                isDropdownOpen 
                                    ? 'opacity-100 scale-100 visible' 
                                    : 'opacity-0 scale-95 invisible'
                            }`}
                        >
                            {/* User info section */}
                            <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                <div className="font-medium">{ name }</div>
                                <div className="font-normal truncate text-gray-500 dark:text-gray-400">{ email }</div>
                            </div>

                            {/* Menu items */}
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                    <button
                                        onClick={() => handleMenuItemClick(() => navigate("/normal-dashboard"))}
                                        className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-150"
                                    >
                                        Dashboard
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleMenuItemClick(() => console.log('Settings clicked'))}
                                        className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-150"
                                    >
                                        Settings
                                    </button>
                                </li>
                            </ul>

                            {/* Sign out section */}
                            <div className="py-2">
                                <button
                                    onClick={() => handleMenuItemClick(handleLogout)}
                                    className="mx-2 w-50 rounded-sm bg-red-500 hover:bg-red-600 cursor-pointer text-left block px-4 py-2 hover:px-5 hover:py-3 text-sm text-neutral-100  dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white transition-all duration-150"
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NormalHeader;