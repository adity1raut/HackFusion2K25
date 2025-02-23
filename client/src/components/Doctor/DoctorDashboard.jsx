import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, Bed, Edit, X, Check } from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    illness: '',
    bedrest: false,
    messege: ''
  });
  const [sortDate, setSortDate] = useState(''); // State for sorting by date
  const [sortTime, setSortTime] = useState(''); // State for sorting by time

  // Fetch all appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/doctor/all-appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Update appointment details
  const updateAppointment = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/doctor/update-appointment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }
      const updatedAppointment = await response.json();
      setAppointments(appointments.map(app => 
        app._id === id ? updatedAppointment : app
      ));
      setEditingId(null);
      setFormData({ illness: '', bedrest: false, messege: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  const startEditing = (appointment) => {
    setEditingId(appointment._id);
    setFormData({
      illness: appointment.illness || '',
      bedrest: appointment.bedrest || false,
      messege: appointment.messege || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({ illness: '', bedrest: false, messege: '' });
  };

  // Sort appointments by date
  const sortAppointmentsByDate = (appointments) => {
    if (sortDate === 'asc') {
      return [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortDate === 'desc') {
      return [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return appointments;
  };

  // Sort appointments by time
  const sortAppointmentsByTime = (appointments) => {
    if (sortTime === 'asc') {
      return [...appointments].sort((a, b) => a.time.localeCompare(b.time));
    } else if (sortTime === 'desc') {
      return [...appointments].sort((a, b) => b.time.localeCompare(a.time));
    }
    return appointments;
  };

  // Apply sorting
  const sortedAppointments = sortAppointmentsByTime(sortAppointmentsByDate(appointments));

  return (
    <div className="mx-auto pt-20 p-6 max-w-7xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500  p-6 rounded-lg shadow-xl mb-8 hover:shadow-2xl transition-shadow duration-300">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Calendar className="w-8 h-8" />
          Doctor's Dashboard
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-md">
          {error}
        </div>
      )}

      {/* Sorting Controls */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Sort by Date</label>
          <select
            value={sortDate}
            onChange={(e) => setSortDate(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            <option value="asc">Today to Upcoming</option>
            <option value="desc">Upcoming to Today</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Sort by Time</label>
          <select
            value={sortTime}
            onChange={(e) => setSortTime(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None</option>
            <option value="asc">Earliest to Latest</option>
            <option value="desc">Latest to Earliest</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading appointments...</div>
        ) : sortedAppointments.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No appointments found</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedAppointments.map(appointment => (
              <div
                key={appointment._id}
                className="p-6 hover:bg-gray-50 transition-all duration-200 hover:shadow-lg"
              >
                {editingId === appointment._id ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <User className="w-6 h-6 text-blue-600" />
                      <span className="font-semibold text-lg">{appointment.name}</span>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Illness"
                        value={formData.illness}
                        onChange={(e) => setFormData({...formData, illness: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-all"
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.bedrest}
                          onChange={(e) => setFormData({...formData, bedrest: e.target.checked})}
                          className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500 hover:border-blue-300 transition-all"
                        />
                        <label className="text-gray-700">Bedrest Required</label>
                      </div>
                      <textarea
                        placeholder="Message"
                        value={formData.messege}
                        onChange={(e) => setFormData({...formData, messege: e.target.value})}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-all"
                        rows="3"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateAppointment(appointment._id)}
                          className="bg-green-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 hover:shadow-lg transition-all"
                        >
                          <Check className="w-5 h-5" /> Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 hover:shadow-lg transition-all"
                        >
                          <X className="w-5 h-5" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-lg">{appointment.name}</span>
                      </div>
                      <button
                        onClick={() => startEditing(appointment)}
                        className="text-blue-500 hover:text-blue-600 flex items-center gap-2 transition-all hover:shadow-md"
                      >
                        <Edit className="w-5 h-5" /> Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span>Roll No: {appointment.rollno}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span>Date: {appointment.date}</span>
                      </div>
                    </div>
                    {appointment.illness && (
                      <div className="mt-4">
                        <strong className="text-gray-700">Illness:</strong> {appointment.illness}
                      </div>
                    )}
                    {appointment.bedrest && (
                      <div className="flex items-center gap-2 text-red-500 mt-2">
                        <Bed className="w-5 h-5" />
                        <span>Bedrest Required</span>
                      </div>
                    )}
                    {appointment.messege && (
                      <div className="mt-4 text-gray-600">
                        <strong>Message:</strong> {appointment.messege}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;