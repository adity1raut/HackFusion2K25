import React, { useState     } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComplainTable from '../Tables/ComplainTable';

const ComplaintsForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        status: 'unread'
    });

    const [complaints, setComplaints] = useState([]); // Store complaints as an array
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        const loadingToast = toast.loading('Submitting complaint...', {
            position: "top-right",
            theme: "light"
        });

        try {
            const response = await fetch('http://localhost:4000/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const newComplaint = await response.json();

            if (!response.ok) {
                throw new Error('Failed to submit complaint');
            }

            // Update complaints state by adding the new complaint to the array
            setComplaints(prevComplaints => [
                ...prevComplaints,
                newComplaint // Assuming newComplaint has an "id" property
            ]);

            toast.update(loadingToast, {
                render: "Complaint submitted successfully! 🎉",
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                status: 'unread'
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: "Failed to submit complaint! Please try again.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-12 text-center">
                    Complaints Management
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form Section */}
                    <div className="lg:w-1/3">
                        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg p-8 sticky top-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Submit a Complaint</h2>
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
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message<span className="text-red-500">*</span></label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white/50 hover:bg-white resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] mt-8 text-lg uppercase tracking-wide ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </form>
                    </div>

                    {/* Complaints List */}
                    <div className="lg:w-2/3">
                        <ComplainTable complaints={complaints} />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ComplaintsForm;
