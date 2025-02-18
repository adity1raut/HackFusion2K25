import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, MessageSquare, Phone, Mail, User, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GroundBooking() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        venue: "",
        date: "",
        lastdate: "",
        time: "",
        message: "",
        status: "pending"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const venues = [
        {
            venue: "Auditorium",
            name: "Auditorium",
            capacity: "400 Seats",
            location: "Admin Building",
            image: "https://res.cloudinary.com/dg6qtpags/image/upload/v1739874682/your-cloudinary-folder-name/yeq93de3i3jk5yniybz8.jpg",
            prize: "20,000"
        },
        {
            venue: "Classrooms",
            name: "Classrooms",
            capacity: "100 Seats",
            image: "https://res.cloudinary.com/dg6qtpags/image/upload/v1739874684/your-cloudinary-folder-name/o6l8nuliwj7w13xtphiz.jpg",
            location: "Near ExTc Department",
            prize: "5,000"
        },
        {
            venue: "Ground",
            name: "Ground",
            image: "https://res.cloudinary.com/dg6qtpags/image/upload/v1739874685/your-cloudinary-folder-name/giq98eafvxn4pz6j5acc.webp",
            capacity: "Varies depending on the events.",
            location: "Near Sahyadri Hostel",
            prize: "10,000"
        }
    ];

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error creating booking');
            }

            toast.success(data.message || "Booking created successfully!");
            setFormData({
                name: "", email: "", phone: "", venue: "",
                date: "", lastdate: "", time: "", message: "", status: "pending"
            });
        } catch (error) {
            toast.error(error.message || "Error creating booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewDetails = (venueName) => {
        navigate(`/bookings/details/${venueName}`);
    };

    const inputClassName = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/90";
    const labelClassName = "block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2";

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <div className="max-w-6xl mx-auto p-4 pt-24">
                {/* Venue Cards */}
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Available Venues
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {venues.map((venue, index) => (
                        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <div className="relative">
                                <img src={venue.image} className="w-full h-48 object-cover" alt={venue.name} />
                                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full shadow-md">
                                    <span className="text-sm font-medium text-gray-700">₹{venue.prize}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h5 className="text-xl font-bold text-gray-800 mb-4">{venue.name}</h5>
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <MapPin size={16} />
                                        <span>{venue.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                                        <Users size={16} />
                                        <span>{venue.capacity}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleViewDetails(venue.name)} className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg text-sm font-medium flex items-center justify-center gap-2">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="my-16 max-w-4xl mx-auto border-t border-green-200" />

                <div className="flex justify-center pb-16">
                    <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                            Book Your Venue
                        </h2>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className={labelClassName}>
                                        <User size={16} /> Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={inputClassName}
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className={labelClassName}>
                                        <Mail size={16} /> Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={inputClassName}
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className={labelClassName}>
                                        <Phone size={16} /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className={inputClassName}
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="venue" className={labelClassName}>
                                        <MapPin size={16} /> Venue
                                    </label>
                                    <select
                                        id="venue"
                                        className={inputClassName}
                                        value={formData.venue}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a venue</option>
                                        {venues.map((venue, index) => (
                                            <option key={index} value={venue.name}>
                                                {venue.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="date" className={labelClassName}>
                                        <Calendar size={16} /> Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        className={inputClassName}
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastdate" className={labelClassName}>
                                        <Calendar size={16} /> End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="lastdate"
                                        className={inputClassName}
                                        value={formData.lastdate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="time" className={labelClassName}>
                                        <Clock size={16} /> Time
                                    </label>
                                    <input
                                        type="time"
                                        id="time"
                                        className={inputClassName}
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className={labelClassName}>
                                    <MessageSquare size={16} /> Message
                                </label>
                                <textarea
                                    id="message"
                                    className={`${inputClassName} resize-none`}
                                    placeholder="Additional details or special requests..."
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all duration-300 text-base font-semibold shadow-md hover:shadow-lg disabled:bg-green-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Clock className="animate-spin" size={18} />
                                        Processing...
                                    </div>
                                ) : (
                                    'Book Now'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default GroundBooking;