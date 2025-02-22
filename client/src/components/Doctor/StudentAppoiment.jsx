import React, { useState } from 'react';
import axios from 'axios';

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rollno: '',
        date: '',
        time: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'time') {
            // Round the time to the nearest 15 minutes
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
            });
            alert('Appointment created successfully!');
        } catch (error) {
            console.error('Error creating appointment:', error);
            alert('Error creating appointment. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="rollno" className="block text-sm font-medium text-gray-700">Roll Number:</label>
                <input
                    type="text"
                    id="rollno"
                    name="rollno"
                    value={formData.rollno}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date:</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time:</label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    step="900" // 15 minutes in seconds
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Create Appointment
            </button>
        </form>
    );
};

export default AppointmentForm;