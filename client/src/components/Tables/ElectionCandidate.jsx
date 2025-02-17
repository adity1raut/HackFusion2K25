
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState , React } from 'react';
import { toast } from 'react-toastify';


function ElectionCandidate() {
      const [availabilities, setAvailabilities] = useState([]);
      const [page, setPage] = useState(1);
      const [totalPages, setTotalPages] = useState(1);
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await fetch(`/api/candidate-list?page=${page}`, {
              credentials: 'include'
            });
            
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            
            const data = await response.json();
            setAvailabilities(data.availabilities);
            setTotalPages(data.totalPages);
          } catch (err) {
            toast.error('Failed to load faculty availabilities. Please try again later.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [page]);
    
  return (
    <div>
       <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
           Election candidate
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acadamic Yera
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilities.map((availability, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div>{availability.name}</div>
                      <div className="text-xs text-gray-500">{availability.designation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {availability.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {availability.dayOfWeek}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {availability.availableTimeSlots.map((slot, index) => (
                        <div key={index}>{slot.start} - {slot.end}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <div className="text-gray-600">
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || loading}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

    </div>
  )
}

export default ElectionCandidate
