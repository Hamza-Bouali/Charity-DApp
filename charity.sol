// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract CharityDonation is Ownable, Pausable {
    struct Charity {
        string name;
        string description;
        string metadataUrl;
        bool isActive;
    }

    struct Campaign {
        string title;
        string description;
        uint256 goalAmount;
        uint256 totalDonated;
        uint256 deadline;
        bool isActive;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    struct CharityRequest {
        address requester;
        string name;
        string description;
        string metadataUrl;
        bool approved;
    }

    mapping(address => Charity) public charities;
    address[] public charityList;
    CharityRequest[] public charityRequests;

    mapping(address => Campaign[]) public campaignsByCharity;
    mapping(uint256 => Donation[]) public donationsToCampaign;
    mapping(address => Donation[]) public donationsByDonor;

    uint256 public minimumDonation = 0.00 ether;

    event CharityRequested(address indexed requester, uint256 indexed requestId, string name);
    event CharityApproved(address indexed charity);
    event CampaignCreated(address indexed charity, uint256 indexed campaignId, string title, uint256 deadline);
    event DonationMade(address indexed donor, address indexed charity, uint256 campaignId, uint256 amount, string message);
    event Withdrawn(address indexed charity, uint256 campaignId, uint256 amount);

    constructor() {}

    modifier onlyCharity() {
        require(charities[msg.sender].isActive, "Not an approved charity");
        _;
    }

    function requestCharityRegistration(
        string calldata name,
        string calldata description,
        string calldata metadataUrl
    ) external {
        require(!charities[msg.sender].isActive, "Already approved as a charity");
        for (uint256 i = 0; i < charityRequests.length; i++) {
            if (charityRequests[i].requester == msg.sender && !charityRequests[i].approved) {
                revert("Request already pending");
            }
        }
        charityRequests.push(CharityRequest({
            requester: msg.sender,
            name: name,
            description: description,
            metadataUrl: metadataUrl,
            approved: false
        }));

        emit CharityRequested(msg.sender, charityRequests.length - 1, name);
    }

    function approveCharity(uint256 requestId) external onlyOwner {
        CharityRequest storage req = charityRequests[requestId];
        require(!req.approved, "Already approved");

        charities[req.requester] = Charity({
            name: req.name,
            description: req.description,
            metadataUrl: req.metadataUrl,
            isActive: true
        });

        charityList.push(req.requester);
        req.approved = true;

        emit CharityApproved(req.requester);
    }

    function updateCharityInfo(
        string calldata name,
        string calldata description,
        string calldata metadataUrl
    ) external onlyCharity {
        charities[msg.sender].name = name;
        charities[msg.sender].description = description;
        charities[msg.sender].metadataUrl = metadataUrl;
    }

    function toggleCharityStatus(address charity, bool status) external onlyOwner {
        require(charities[charity].isActive != status, "Already set");
        charities[charity].isActive = status;
    }

    function createCampaign(
        string calldata title,
        string calldata description,
        uint256 goalAmount,
        uint256 durationInDays
    ) external onlyCharity {
        require(durationInDays > 0, "Invalid duration");

        uint256 deadline = block.timestamp + (durationInDays * 1 days);

        campaignsByCharity[msg.sender].push(Campaign({
            title: title,
            description: description,
            goalAmount: goalAmount,
            totalDonated: 0,
            deadline: deadline,
            isActive: true
        }));

        uint256 campaignId = campaignsByCharity[msg.sender].length - 1;
        emit CampaignCreated(msg.sender, campaignId, title, deadline);
    }

    function toggleCampaignStatus(uint256 campaignId) external onlyCharity {
        require(campaignId < campaignsByCharity[msg.sender].length, "Invalid campaign");

        Campaign storage campaign = campaignsByCharity[msg.sender][campaignId];
        campaign.isActive = !campaign.isActive;
    }

    function donateToCampaign(
        address charity,
        uint256 campaignId,
        string calldata message
    ) external payable whenNotPaused {
        require(charities[charity].isActive, "Charity not active");
        require(campaignId < campaignsByCharity[charity].length, "Invalid campaign");

        Campaign storage campaign = campaignsByCharity[charity][campaignId];
        require(campaign.isActive, "Campaign inactive");
        require(block.timestamp <= campaign.deadline, "Campaign ended");
        require(msg.value >= minimumDonation, "Too little");

        campaign.totalDonated += msg.value;

        donationsToCampaign[_campaignKey(charity, campaignId)].push(
            Donation(msg.sender, msg.value, block.timestamp, message)
        );

        donationsByDonor[msg.sender].push(
            Donation(msg.sender, msg.value, block.timestamp, message)
        );

        emit DonationMade(msg.sender, charity, campaignId, msg.value, message);
    }

    function withdrawCampaignFunds(uint256 campaignId) external onlyCharity whenNotPaused {
        require(campaignId < campaignsByCharity[msg.sender].length, "Invalid campaign");

        Campaign storage campaign = campaignsByCharity[msg.sender][campaignId];
        uint256 amount = campaign.totalDonated;
        require(amount > 0, "Nothing to withdraw");

        campaign.totalDonated = 0;
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, campaignId, amount);
    }

    function pauseContract() external onlyOwner {
        _pause();
    }

    function unpauseContract() external onlyOwner {
        _unpause();
    }

    function setMinimumDonation(uint256 amount) external onlyOwner {
        minimumDonation = amount;
    }

    function getCharities() external view returns (address[] memory) {
        return charityList;
    }

    function getCampaigns(address charity) external view returns (Campaign[] memory) {
        return campaignsByCharity[charity];
    }

    function getDonationsToCampaign(address charity, uint256 campaignId) external view returns (Donation[] memory) {
        return donationsToCampaign[_campaignKey(charity, campaignId)];
    }

    function getMyDonations() external view returns (Donation[] memory) {
        return donationsByDonor[msg.sender];
    }

    function getCharityRequests() external view returns (CharityRequest[] memory) {
        return charityRequests;
    }

    function _campaignKey(address charity, uint256 campaignId) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(charity, campaignId)));
    }
}
