import React, { useState } from "react";
import axios from "axios";

function GroundBooking() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        venue: "",
        startDate: "",
        endDate: "",
        time: "",
        message: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/booking", formData);
            console.log("Booking created:", response.data);
        } catch (error) {
            console.error("Error creating booking:", error.response.data);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-5 pt-20">
                    {[1, 2, 3].map((card) => (
                        <div 
                            key={card}
                            className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            <img 
                                src="/api/placeholder/400/300"
                                className="w-full h-56 object-cover" 
                                alt="Venue" 
                            />
                            <div className="p-6">
                                <h5 className="text-2xl font-bold text-gray-800 mb-3">Venue {card}</h5>
                                <p className="text-gray-600 leading-relaxed">
                                    A beautiful venue perfect for your events. Book now to reserve your spot!
                                </p>
                                <button className="mt-6 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="my-16 border-t border-green-200" />

                {/* Booking Form Section */}
                <div className="flex justify-center pb-16">
                    <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                            <span className="border-b-4 border-green-500 pb-2">Book Your Venue</span>
                        </h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        placeholder="Enter your name" 
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        placeholder="Enter your email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        placeholder="Enter your phone number" 
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="venue" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Venue
                                    </label>
                                    <select 
                                        id="venue" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        value={formData.venue}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a venue</option>
                                        <option value="venue1">Venue 1</option>
                                        <option value="venue2">Venue 2</option>
                                        <option value="venue3">Venue 3</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input 
                                        type="date" 
                                        id="startDate" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        value={formData.startDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input 
                                        type="date" 
                                        id="endDate" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        value={formData.endDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Time
                                    </label>
                                    <input 
                                        type="time" 
                                        id="time" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        value={formData.time}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea 
                                    id="message" 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                    placeholder="Additional details or special requests..."
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 text-lg font-semibold shadow-md hover:shadow-lg"
                            >
                                Book Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroundBooking;
