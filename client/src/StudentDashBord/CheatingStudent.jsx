import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CheatingStudent() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/api/cheating');
        setReports(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Cheating Reports</h1>
      <ul>
        {reports.map((report) => (
          <li key={report._id}>
            <h2>{report.name}</h2>
            <p><strong>Reason:</strong> {report.reason}</p>
            <p><strong>Email:</strong> {report.email}</p>
            <p><strong>Reported By:</strong> {report.reportedBy}</p>
            <p><strong>Proof:</strong> <a href={report.proof} target="_blank" rel="noopener noreferrer">View Image</a></p>
            <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CheatingStudent;
