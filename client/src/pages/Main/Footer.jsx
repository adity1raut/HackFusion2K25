import React from 'react'

function Footer() {
    return (
        <div>
            <footer className="bg-blue-300 text-white py-6 mb-0">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-base md:text-xl lg:text-1xl">
                        <div className="text-center md:text-left">
                            <p>© 2025 SGGSIE&T. All rights reserved.</p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end space-x-4">
                            <a href="#" className="hover:text-blue-300">Contact</a>
                            <a href="#" className="hover:text-blue-300">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-300">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>


        </div>
    )
}

export default Footer
