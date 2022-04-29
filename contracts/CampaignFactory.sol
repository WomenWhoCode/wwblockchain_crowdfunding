// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title CampaignFactory
 * @dev Store & retrieve Crowdfunding campaigns in a variable
 */

contract CampaignFactory {

    Campaign[] public deployedCampaigns;

    function createCampaign(uint minimumFund, uint threshold, string memory name, string memory description, string memory image, uint targetFund) public {
        Campaign newCampaign = new Campaign(minimumFund, threshold, name, description, image, targetFund);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    struct Contributor {
        bool hasFundBefore;
        bool isApprover;
        uint contribution;
    }

    struct Request {
        string description;
        uint requestFund;
        address payable recipient;
        bool isCompleted;
        uint weighted;
        uint nonApproverCount;
        uint approverCount;
        address[] nonApprovers;
        address[] approvers;
    }

    uint public minimumPayment;
    uint public thresholdToBeApprover;
    address public campaignOwner;
    string public campaignName;
    string public campaignDescription;
    string public imageUrl;
    uint public targetAmount;
    bool public complete;
    uint public fundReceivedSoFar;
    mapping(address => Contributor) contributors;
    address[] public approvers;
    uint public contributorCount;
    uint public approverCount;
    mapping (uint => Request) requests;
    uint public requestIndex;

    constructor(uint minimumFund, uint threshold, string memory name, string memory description, string memory image, uint targetFund) {
        minimumPayment = minimumFund;
        thresholdToBeApprover = threshold;
        campaignOwner = msg.sender;
        campaignName = name;
        campaignDescription = description;
        imageUrl = image;
        targetAmount = targetFund;
        complete = false;
        contributorCount = 0;
        approverCount = 0;
        requestIndex = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == campaignOwner, "Oops! Action is only available to campaign's owner.");
        _;
    }

    modifier excludeOwner() {
         require(msg.sender != campaignOwner, "Oops! Campaign creators are not allowed to fund their own campaigns.");
         _;
    }

    function createRequest(string memory description, uint requestFund, address payable recipient, uint weighted) public onlyOwner {
        Request storage newRequest = requests[requestIndex++];
        newRequest.description = description;
        newRequest.requestFund = requestFund;
        newRequest.recipient = recipient;
        newRequest.isCompleted = false;
        newRequest.weighted  = weighted;
        newRequest.nonApproverCount = 0;
        newRequest.approverCount = 0;
    }

    function approveRequest(uint index) public excludeOwner {
        require(contributors[msg.sender].hasFundBefore == true, "Sorry you are not eligible to approve the request.");
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

    function finalizeRequest(uint index) public onlyOwner {
        uint totalWeightedApprovals = requests[index].nonApproverCount + (requests[index].approverCount * requests[index].weighted);
        require(!requests[index].isCompleted, "The request has already been finalized.");
        require(totalWeightedApprovals > (contributorCount / 2), "The voting has not passed yet.");
        require(address(this).balance >= requests[index].requestFund, "The total contribution to this campaign is not enough to pay the request.");

        requests[index].recipient.transfer(requests[index].requestFund);
        requests[index].isCompleted = true;
    }

    function receiveFund() public payable excludeOwner {
        require(msg.value >= minimumPayment, "Oops! Funding doesn't meet the minimum contribution.");

        if ((contributors[msg.sender]).hasFundBefore == false) {
            contributors[msg.sender] = Contributor(true, false, msg.value);
            ++contributorCount;
        }
        else {
            contributors[msg.sender].contribution += msg.value;
        }

        if ((contributors[msg.sender].isApprover == false) && (msg.value >= thresholdToBeApprover)) {
            contributors[msg.sender].isApprover = true;
            ++approverCount;
        }

        fundReceivedSoFar += msg.value;
    }

    function showCurrentFund() public view returns(uint) {
        return address(this).balance;
    }

    function withdrawTotalFund(address payable _to) public onlyOwner {
        _to.transfer(address(this).balance);
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
}