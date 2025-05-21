import React, { useState, useEffect, useContext } from 'react';
import { WalletContext, WalletContextProps } from '../context/WalletContext';
import Web3 from 'web3';
import { contractABI, contractAddress } from '../utils/constants';

const CharityRequests = () => {
  const { account } = useContext(WalletContext) as WalletContextProps;
  const [requests, setRequests] = useState([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    if (account) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    }
  }, [account]);

  const requestCharityRegistration = async () => {
    const name = (document.getElementById('cName') as HTMLInputElement).value;
    const desc = (document.getElementById('cDesc') as HTMLInputElement).value;
    const meta = (document.getElementById('cMeta') as HTMLInputElement).value;

    if (contract && account) {
      await contract.methods.requestCharityRegistration(name, desc, meta).send({ from: account });
      alert('Charity request submitted');
    }
  };

  const loadCharityRequests = async () => {
    if (contract) {
      const requestsData = await contract.methods.getCharityRequests().call();
      setRequests(requestsData);
    }
  };

  const approve = async (id: number) => {
    if (contract && account) {
      await contract.methods.approveCharity(id).send({ from: account });
      alert('Charity approved');
      loadCharityRequests();
    }
  };

  return (
    <div>
      <section>
        <h2>Request Charity Registration</h2>
        <input id="cName" placeholder="Name" />
        <input id="cDesc" placeholder="Description" />
        <input id="cMeta" placeholder="Metadata URL" />
        <button onClick={requestCharityRegistration}>Submit Request</button>
      </section>

      <section>
        <h2>Admin: Approve Charity Requests</h2>
        <button onClick={loadCharityRequests}>Load Requests</button>
        <div id="requests">
          {requests.map((r: any, i: number) => (
            !r.approved && (
              <p key={i}>
                <b>{r.name}</b> - {r.description}{' '}
                <button onClick={() => approve(i)}>Approve</button>
              </p>
            )
          ))}
        </div>
      </section>
    </div>
  );
};

export default CharityRequests;
