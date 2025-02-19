// ComplaintsTable.jsx
import React from 'react';
import { Check, X } from 'lucide-react';

const ComplainTable = () => {
  const [complaints, setComplaints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/complaints');
      if (!response.ok) throw new Error('Failed to fetch complaints');
      const data = await response.json();
      setComplaints(data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:4000/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      // Update local state
      setComplaints(complaints.map(complaint => 
        complaint._id === id ? { ...complaint, status: newStatus } : complaint
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  React.useEffect(() => {
    fetchComplaints();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto pt-20">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Subject</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{complaint.name}</td>
              <td className="px-6 py-4">{complaint.subject}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  complaint.status === 'approved' ? 'bg-green-100 text-green-800' :
                  complaint.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {complaint.status}
                </span>
              </td>
              <td className="px-6 py-4">
                {complaint.status === 'unread' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(complaint._id, 'approved')}
                      className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(complaint._id, 'rejected')}
                      className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplainTable;