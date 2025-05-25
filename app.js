let web3, contract, account;
const contractAddress = "0xCfEB869F69431e42cdB54A4F4f105C19C080A601"; // Replace with deployed address
const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "charity",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "campaignId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "CampaignCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "charity",
          "type": "address"
        }
      ],
      "name": "CharityApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "CharityRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "charity",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "campaignId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "DonationMade",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "charity",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "campaignId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdrawn",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "campaignsByCharity",
      "outputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "goalAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalDonated",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "charities",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataUrl",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "charityList",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "charityRequests",
      "outputs": [
        {
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataUrl",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "donationsByDonor",
      "outputs": [
        {
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "donationsToCampaign",
      "outputs": [
        {
          "internalType": "address",
          "name": "donor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "minimumDonation",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataUrl",
          "type": "string"
        }
      ],
      "name": "requestCharityRegistration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        }
      ],
      "name": "approveCharity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "metadataUrl",
          "type": "string"
        }
      ],
      "name": "updateCharityInfo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "charity",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "status",
          "type": "bool"
        }
      ],
      "name": "toggleCharityStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "goalAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "durationInDays",
          "type": "uint256"
        }
      ],
      "name": "createCampaign",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "campaignId",
          "type": "uint256"
        }
      ],
      "name": "toggleCampaignStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "charity",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "campaignId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "name": "donateToCampaign",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "campaignId",
          "type": "uint256"
        }
      ],
      "name": "withdrawCampaignFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pauseContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpauseContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "setMinimumDonation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCharities",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "charity",
          "type": "address"
        }
      ],
      "name": "getCampaigns",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "goalAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalDonated",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            }
          ],
          "internalType": "struct CharityDonation.Campaign[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "charity",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "campaignId",
          "type": "uint256"
        }
      ],
      "name": "getDonationsToCampaign",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "donor",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            }
          ],
          "internalType": "struct CharityDonation.Donation[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getMyDonations",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "donor",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            }
          ],
          "internalType": "struct CharityDonation.Donation[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getCharityRequests",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "requester",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "metadataUrl",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "approved",
              "type": "bool"
            }
          ],
          "internalType": "struct CharityDonation.CharityRequest[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]; // Paste ABI from JSON artifact

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: 'eth_requestAccounts' });
    account = (await web3.eth.getAccounts())[0];
    document.getElementById("wallet").innerText = `Connected: ${account}`;
    contract = new web3.eth.Contract(abi, contractAddress);
  }
}

async function requestCharityRegistration() {
  try {
    const name = document.getElementById("cName").value.trim();
    const description = document.getElementById("cDesc").value.trim();
    const metadataUrl = document.getElementById("cMeta").value.trim();

    if (!name || !description || !metadataUrl) {
      alert("Please fill in all fields.");
      console.error("Validation failed: Missing input fields.");
      return;
    }

    console.log("Inputs for charity registration:", { name, description, metadataUrl });

    // Fetch contract state for validation
    const charityState = await contract.methods.charities(account).call();
    if (charityState.isActive) {
      alert("You are already an approved charity.");
      console.error("Validation failed: Already an approved charity.");
      return;
    }

    const charityRequests = await contract.methods.getCharityRequests().call();
    const hasPendingRequest = charityRequests.some(
      (request) => request.requester.toLowerCase() === account.toLowerCase() && !request.approved
    );

    if (hasPendingRequest) {
      alert("You already have a pending charity registration request.");
      console.error("Validation failed: Pending charity registration request.");
      return;
    }

    const gasEstimate = await contract.methods
      .requestCharityRegistration(name, description, metadataUrl)
      .estimateGas({ from: account });

    console.log("Estimated gas:", gasEstimate);

    await contract.methods
      .requestCharityRegistration(name, description, metadataUrl)
      .send({ from: account, gas: gasEstimate });

    alert("Charity registration request submitted successfully!");
  } catch (error) {
    console.error("Failed to submit charity registration request:", error);
    alert("Charity registration request failed. Please check the console for details.");
  }
}

async function loadCharityRequests() {
  const requests = await contract.methods.getCharityRequests().call();
  const container = document.getElementById("charity-requests");
  container.innerHTML = "";
  requests.forEach((r, i) => {
    if (!r.approved) {
      container.innerHTML += `<p>${r.name} - ${r.description}
        <button onclick="approveCharity(${i})">Approve</button></p>`;
    }
  });
}

async function approveCharity(id) {
  await contract.methods.approveCharity(id).send({ from: account });
}

async function pauseContract() {
  await contract.methods.pauseContract().send({ from: account });
}
async function unpauseContract() {
  await contract.methods.unpauseContract().send({ from: account });
}
async function setMinDonation() {
  const val = web3.utils.toWei(minDonation.value, "ether");
  await contract.methods.setMinimumDonation(val).send({ from: account });
}

async function createCampaign() {
  const t = campTitle.value, d = campDesc.value;
  const g = web3.utils.toWei(campGoal.value, "ether");
  const dur = campDuration.value;
  await contract.methods.createCampaign(t, d, g, dur).send({ from: account });
}

async function loadMyCampaigns() {
  const camps = await contract.methods.getCampaigns(account).call();
  const div = document.getElementById("my-campaigns");
  div.innerHTML = "";
  camps.forEach((c, i) => {
    div.innerHTML += `<p>${c.title} | ${web3.utils.fromWei(c.totalDonated, 'ether')} ETH raised 
      <button onclick="toggleCampaign(${i})">Toggle</button>
      <button onclick="withdraw(${i})">Withdraw</button></p>`;
  });
}

async function toggleCampaign(id) {
  await contract.methods.toggleCampaignStatus(id).send({ from: account });
}

async function withdraw(id) {
  await contract.methods.withdrawCampaignFunds(id).send({ from: account });
}

async function donate() {
  const to = donateTo.value;
  const id = donateId.value;
  const msg = donateMsg.value;
  const value = web3.utils.toWei(donateAmt.value, "ether");
  await contract.methods.donateToCampaign(to, id, msg).send({ from: account, value });
}

async function getMyDonations() {
  const dons = await contract.methods.getMyDonations().call({ from: account });
  const div = document.getElementById("my-donations");
  div.innerHTML = "";
  dons.forEach(d => {
    div.innerHTML += `<p>${web3.utils.fromWei(d.amount)} ETH | ${d.message}</p>`;
  });
}
