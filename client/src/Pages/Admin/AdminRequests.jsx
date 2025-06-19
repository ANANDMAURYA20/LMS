import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../Helpers/axiosInstance';

export default function AdminRequests() {
  const [activeTab, setActiveTab] = useState('courses');
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      const endpoint = activeTab === 'courses' ? '/api/v1/request/course/pending' : '/api/v1/request/lecture/pending';
      const response = await axiosInstance.get(endpoint);
      setRequests(response.data.requests);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  const handleAction = async (requestId, action, comment = '') => {
    try {
      const endpoint = `${activeTab === 'courses' ? '/api/v1/request/course/' : '/api/v1/request/lecture/'}${requestId}`;
      await axiosInstance.patch(endpoint, { status: action, adminComment: comment });
      toast.success(`Request ${action} successfully`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to process request');
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'courses' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('courses')}
        >
          Course Requests
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'lectures' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('lectures')}
        >
          Lecture Requests
        </button>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request._id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{request.title}</h3>
            <p className="text-gray-600">{request.description}</p>
            <div className="mt-4 flex gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleAction(request._id, 'approved')}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  const comment = prompt('Enter rejection reason:');
                  if (comment) handleAction(request._id, 'rejected', comment);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}