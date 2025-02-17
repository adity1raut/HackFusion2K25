import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FacultyTable from '../Tables/FacultyTable';

const FacultyAvailabilityForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        dayOfWeek: '',
        availableTimeSlots: [{ start: '', end: '' }]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availabilities, setAvailabilities] = useState([]); // Added state for fetched availabilities

    const departments = [
        'Computer Science',
        'Information Technology',
        'Electronics',
        'Mechanical',
        'Civil',
        'Electrical'
    ];

    const designations = [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Lecturer'
    ];

    const daysOfWeek = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTimeSlotChange = (index, field, value) => {
        const newTimeSlots = [...formData.availableTimeSlots];
        newTimeSlots[index] = {
            ...newTimeSlots[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            availableTimeSlots: newTimeSlots
        }));
    };

    const addTimeSlot = () => {
        setFormData(prev => ({
            ...prev,
            availableTimeSlots: [...prev.availableTimeSlots, { start: '', end: '' }]
        }));
    };

    const removeTimeSlot = (index) => {
        if (formData.availableTimeSlots.length > 1) {
            setFormData(prev => ({
                ...prev,
                availableTimeSlots: prev.availableTimeSlots.filter((_, i) => i !== index)
            }));
        }
    };

    const fetchAvailabilities = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/faculty-availability');
            setAvailabilities(response.data); // Set the fetched availabilities
        } catch (error) {
            toast.error('Failed to fetch availabilities.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const loadingToast = toast.loading('Submitting availability...');

        try {
            await axios.post('http://localhost:4000/api/faculty-availability', formData);
            
            toast.update(loadingToast, {
                render: "Availability submitted successfully! 🎉",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            setFormData({
                name: '',
                email: '',
                phone: '',
                department: '',
                designation: '',
                dayOfWeek: '',
                availableTimeSlots: [{ start: '', end: '' }]
            });

            fetchAvailabilities(); // Refresh the availability list after submission
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Failed to submit availability",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchAvailabilities(); // Fetch the availabilities when the component mounts
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 text-center">
                    Faculty Availability Management
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form Section */}
                    <div className="lg:w-1/3">
                        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 sticky top-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Add Availability</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                        placeholder="Faculty name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                        placeholder="faculty@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                        placeholder="Contact number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department<span className="text-red-500">*</span></label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation<span className="text-red-500">*</span></label>
                                    <select
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                    >
                                        <option value="">Select Designation</option>
                                        {designations.map(desig => (
                                            <option key={desig} value={desig}>{desig}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week<span className="text-red-500">*</span></label>
                                    <select
                                        name="dayOfWeek"
                                        value={formData.dayOfWeek}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                    >
                                        <option value="">Select Day</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">Time Slots<span className="text-red-500">*</span></label>
                                        <button
                                            type="button"
                                            onClick={addTimeSlot}
                                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            + Add Time Slot
                                        </button>
                                    </div>
                                    
                                    {formData.availableTimeSlots.map((slot, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <input
                                                    type="time"
                                                    value={slot.start}
                                                    onChange={(e) => handleTimeSlotChange(index, 'start', e.target.value)}
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="time"
                                                    value={slot.end}
                                                    onChange={(e) => handleTimeSlotChange(index, 'end', e.target.value)}
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                                />
                                            </div>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeTimeSlot(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] mt-8 text-lg uppercase tracking-wide ${
                                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Availability'}
                            </button>
                        </form>
                    </div>

                    {/* Availabilities List */}
                    <div className="lg:w-2/3">
                       <FacultyTable availabilities={availabilities} />
                    </div>
                </div>
            </div>
            
            <ToastContainer />
        </div>
    );
}

export default FacultyAvailabilityForm;
