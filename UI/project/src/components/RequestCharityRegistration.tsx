import React, { useState } from 'react';

const RequestCharityRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [metadataUrl, setMetadataUrl] = useState('');

  const requestCharityRegistration = async () => {
    try {
      // Add logic to interact with the smart contract
      console.log('Requesting charity registration:', { name, description, metadataUrl });
    } catch (error) {
      console.error('Error requesting charity registration:', error);
    }
  };

  return (
    <section className="mt-8">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Request Charity Registration</h2>
      </div>
      <input
        id="cName"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input mb-2"
      />
      <input
        id="cDesc"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input mb-2"
      />
      <input
        id="cMeta"
        placeholder="Metadata URL"
        value={metadataUrl}
        onChange={(e) => setMetadataUrl(e.target.value)}
        className="input mb-2"
      />
      <button
        onClick={requestCharityRegistration}
        className="btn px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm"
      >
        Submit Request
      </button>
    </section>
  );
};

export default RequestCharityRegistration;
