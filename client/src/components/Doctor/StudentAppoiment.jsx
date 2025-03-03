import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rollno: '',
        date: '',
        time: '',
        classCordinatorEmail: '',
        parentEmail: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle time rounding for the time input
        if (name === 'time') {
            const timeParts = value.split(':');
            let hours = parseInt(timeParts[0], 10);
            let minutes = parseInt(timeParts[1], 10);

            minutes = Math.round(minutes / 15) * 15;
            if (minutes === 60) {
                minutes = 0;
                hours += 1;
            }

            const roundedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            setFormData({
                ...formData,
                [name]: roundedTime,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/appointments', formData);
            console.log('Appointment created:', response.data);
            // Reset form data
            setFormData({
                name: '',
                email: '',
                rollno: '',
                date: '',
                time: '',
                classCordinatorEmail: '',
                parentEmail: ''
            });
            // Show success toast
            toast.success('Appointment created successfully!', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Error creating appointment:', error);
            // Show error toast
            toast.error('Error creating appointment. Please try again.', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
                {/* Heading */}
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Doctor Appointment
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="rollno" className="block text-sm font-medium text-gray-700">
                            Roll Number:
                        </label>
                        <input
                            type="text"
                            id="rollno"
                            name="rollno"
                            value={formData.rollno}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date:
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                            Time:
                        </label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            step="900" // 15 minutes in seconds
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="classCordinatorEmail" className="block text-sm font-medium text-gray-700">
                            Class Coordinator Email:
                        </label>
                        <input
                            type="email"
                            id="classCordinatorEmail"
                            name="classCordinatorEmail"
                            value={formData.classCordinatorEmail}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700">
                            Parent Email:
                        </label>
                        <input
                            type="email"
                            id="parentEmail"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Create Appointment
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast Container */}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default AppointmentForm;