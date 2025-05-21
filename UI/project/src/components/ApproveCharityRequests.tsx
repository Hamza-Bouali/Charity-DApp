import React, { useState } from 'react';

const ApproveCharityRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);

  const loadCharityRequests = async () => {
    try {
      // Add logic to fetch charity requests from the smart contract
      console.log('Loading charity requests...');
      // Example: setRequests(fetchedRequests);
    } catch (error) {
      console.error('Error loading charity requests:', error);
    }
  };

  const approveRequest = async (requestId: number) => {
    try {
      // Add logic to approve a charity request via the smart contract
      console.log('Approving request:', requestId);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  return (
    <section className="mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Admin: Approve Charity Requests</h2>
      </div>
      <button
        onClick={loadCharityRequests}
        className="btn px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm mb-4"
      >
        Load Requests
      </button>
      <div id="requests">
        {requests.length > 0 ? (
          <ul>
            {requests.map((request, index) => (
              <li key={index} className="mb-2">
                <p>{request.name}</p>
                <button
                  onClick={() => approveRequest(index)}
                  className="btn px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors shadow-sm"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No requests found.</p>
        )}
      </div>
    </section>
  );
};

export default ApproveCharityRequests;
