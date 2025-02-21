import React from 'react'

function Footer() {
    return (
        <div>
            <footer className="bg-blue-900 text-white py-6">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p>© 2025 SGGSIE&T. All rights reserved by The Defaulters.</p>
                        </div>
                        <div className="flex space-x-4">
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
