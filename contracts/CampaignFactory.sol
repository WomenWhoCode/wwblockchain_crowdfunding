// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

/**
 * @title CampaignFactory
 * @dev Store & retrieve Crowdfunding campaigns in a variable
 */

contract CampaignFactory {

    Campaign[] deployedCampaigns;

    event CampaignCreated(address owner, uint minimumFund, uint threshold, string name, string description, string image, uint targetFund);

    function createCampaign(uint minimumFund, uint threshold, string memory name, 
        string memory description, string memory image, uint targetFund) external {

        Campaign newCampaign = new Campaign(msg.sender, minimumFund, threshold, name, description, image, targetFund);
        deployedCampaigns.push(newCampaign);

        emit CampaignCreated(msg.sender, minimumFund, threshold, name, description, image, targetFund);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    struct Contributor {
        bool isApprover;
        uint contribution;
    }

    enum State {
        Fundraising,
        Expired,
        Successful,
        Finished
    }

    struct Request {
        string description;
        uint requestFund;
        bool isCompleted;
        uint weighted;
        uint nonApproverCount;
        uint approverCount;
        address[] nonApprovers;
        address[] approvers;
    }

    uint minimumPayment;
    uint thresholdToBeApprover;
    address campaignOwner;
    string campaignName;
    string campaignDescription;
    string imageUrl;
    uint targetAmount;
    uint fundReceivedSoFar;
    mapping(address => Contributor) contributors;
    address[] approvers;
    uint contributorCount;
    uint approverCount;
    mapping (uint => Request) requests;
    uint requestIndex;
    State state;

    // Event that will be emitted whenever funding will be received
    event FundingReceived(address contributor, uint amount, uint fundReceivedSoFar);
    // Event that will be emitted whenever the project starter has received the funds
    event OwnerPaid(address recipient, uint amount);
    event CampaignFinished(address owner, string name, string description, uint targetAmount, uint fundReceivedSoFar);

    constructor(address owner, uint minimumFund, uint threshold, string memory name, string memory description, string memory image, uint targetFund) {
        minimumPayment = minimumFund;
        thresholdToBeApprover = threshold;
        campaignOwner = owner;
        campaignName = name;
        campaignDescription = description;
        imageUrl = image;
        targetAmount = targetFund;
        contributorCount = 0;
        approverCount = 0;
        requestIndex = 0;
        state = State.Fundraising;
    }

    modifier onlyOwner() {
        require(msg.sender == campaignOwner, "Oops! Action is only available to campaign's owner.");
        _;
    }

    modifier excludeOwner() {
         require(msg.sender != campaignOwner, "Oops! Campaign creators are not allowed to fund their own campaigns.");
         _;
    }

    // Modifier to check current state
    modifier inState(State _state) {
        require(state == _state, "Wrong campaign state!");
        _;
    }
    modifier notInState(State _state) {
        require(state != _state, "Wrong campaign state!");
        _;
    }

    function createRequest(string memory description, uint requestFund, uint weighted) public onlyOwner inState(State.Successful) {
        Request storage newRequest = requests[requestIndex++];
        newRequest.description = description;
        newRequest.requestFund = requestFund;
        newRequest.isCompleted = false;
        newRequest.weighted  = weighted;
        newRequest.nonApproverCount = 0;
        newRequest.approverCount = 0;
    }

    function approveRequest(uint index) public excludeOwner {
        require(contributors[msg.sender].contribution > 0, "Sorry you are not eligible to approve the request.");
        require(hasVotedBefore(index, msg.sender) == false, "You have voted the request already.");
        if (isApprover(msg.sender)) {
            requests[index].nonApproverCount++;
            requests[index].approvers.push(msg.sender);
        }
        else {
            requests[index].approverCount++;
            requests[index].nonApprovers.push(msg.sender);
        }
    }

    function finalizeRequest(uint index) public payable onlyOwner {
        uint totalWeightedApprovals = requests[index].nonApproverCount + (requests[index].approverCount * requests[index].weighted);
        require(!requests[index].isCompleted, "The request has already been finalized.");
        require(totalWeightedApprovals > (contributorCount / 2), "The voting has not passed yet.");
        require(address(this).balance >= requests[index].requestFund, "The total contribution to this campaign is not enough to pay the request.");

        payable(campaignOwner).transfer(requests[index].requestFund);
        requests[index].isCompleted = true;
        emit OwnerPaid(campaignOwner, requests[index].requestFund);

        if (address(this).balance == 0) {
            state = State.Finished;
            emit CampaignFinished(campaignOwner, campaignName, campaignDescription, targetAmount, fundReceivedSoFar);
        }
    }

    function receiveFund() external payable excludeOwner notInState(State.Finished) {
        require(msg.value >= minimumPayment, "Oops! Funding doesn't meet the minimum contribution.");

        if ((contributors[msg.sender]).contribution > 0) {
            contributors[msg.sender].contribution += msg.value;
        }
        else {
            contributors[msg.sender] = Contributor(false, msg.value);
            ++contributorCount;
        }

        if (contributors[msg.sender].isApprover == false && contributors[msg.sender].contribution >= thresholdToBeApprover) {
            contributors[msg.sender].isApprover = true;
            ++approverCount;
        }

        fundReceivedSoFar += msg.value;
        if (fundReceivedSoFar >= targetAmount) {
            state = State.Successful;
        }
        emit FundingReceived(msg.sender, msg.value, fundReceivedSoFar);
    }

    function showCurrentBalance() public view returns(uint) {
        return address(this).balance;
    }

    function hasVotedBefore(uint index, address _receipient) private view returns(bool) {
        if (isApprover(_receipient)) {
            uint _len = requests[index].approvers.length;
            for (uint i = 0; i < _len; ++i) {
                if (requests[index].approvers[i] == _receipient) {
                    return true;
                }
            }
        }
        else {
            uint _len = requests[index].nonApprovers.length;
            for (uint i = 0; i < _len; ++i) {
                if (requests[index].nonApprovers[i] == _receipient) {
                    return true;
                }
            }
        }
        return false;
    }

    function isApprover(address _receipient) private view returns(bool) {
        return contributors[_receipient].isApprover;
    }

    function getDetails() public view returns (
        uint minPayment,
        uint threshold,
        address owner,
        string memory name,
        string memory description,
        string memory image,
        uint targetAmt,
        uint fundReceived,
        State campaignState,
        uint balance,
        uint contributorsCount,
        uint approversCount
    ){
        minPayment = minimumPayment;
        threshold = thresholdToBeApprover;
        owner = campaignOwner;
        name = campaignName;
        description = campaignDescription;
        image = imageUrl;
        targetAmt = targetAmount;
        fundReceived = fundReceivedSoFar;
        campaignState = state;
        balance = address(this).balance;
        contributorsCount = contributorCount;
        approversCount = approverCount;
    }
}