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

  return (
    <div className="mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Doctor's Dashboard
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center">No appointments found</div>
        ) : (
          <div className="divide-y">
            {appointments.map(appointment => (
              <div key={appointment._id} className="p-4">
                {editingId === appointment._id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{appointment.name}</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Illness"
                        value={formData.illness}
                        onChange={(e) => setFormData({...formData, illness: e.target.value})}
                        className="w-full p-2 border rounded"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.bedrest}
                          onChange={(e) => setFormData({...formData, bedrest: e.target.checked})}
                        />
                        <label>Bedrest Required</label>
                      </div>
                      <textarea
                        placeholder="Message"
                        value={formData.messege}
                        onChange={(e) => setFormData({...formData, messege: e.target.value})}
                        className="w-full p-2 border rounded"
                        rows="3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateAppointment(appointment._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" /> Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        <span className="font-medium">{appointment.name}</span>
                      </div>
                      <button
                        onClick={() => startEditing(appointment)}
                        className="text-blue-500 flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Roll No: {appointment.rollno}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Date: {appointment.date}
                      </div>
                    </div>
                    {appointment.illness && (
                      <div className="mt-2">
                        <strong>Illness:</strong> {appointment.illness}
                      </div>
                    )}
                    {appointment.bedrest && (
                      <div className="flex items-center gap-1 text-red-500">
                        <Bed className="w-4 h-4" />
                        Bedrest Required
                      </div>
                    )}
                    {appointment.messege && (
                      <div className="mt-2 text-gray-600">
                        {appointment.messege}
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