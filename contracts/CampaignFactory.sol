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

    uint public minimumPayment;
    uint public thresholdToBeApprover;
    address public campaignOwner;
    string public campaignName;
    string public campaignDescription;
    string public imageUrl;
    uint public targetAmount;
    bool public complete;
    uint public fundReceivedSoFar;
    address[] public contributers;
    address[] public approvers;
    uint public totalContributers;
    uint public approversCount;


    constructor(uint minimumFund, uint threshold, string memory name, string memory description, string memory image, uint targetFund) {
        minimumPayment = minimumFund;
        thresholdToBeApprover = threshold;
        campaignOwner = msg.sender;
        campaignName = name;
        campaignDescription = description;
        imageUrl = image;
        targetAmount = targetFund;
        complete = false;
        totalContributers = 0;
        approversCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == campaignOwner, "Action is only available to campaign's owner.");
        _;
    }

    function receiveFund() public payable {
        require(msg.value >= minimumPayment);

        contributers.push(msg.sender);
        fundReceivedSoFar += msg.value;
        ++totalContributers;

        if (msg.value >= thresholdToBeApprover) {
            approvers.push(msg.sender);
            ++approversCount;
        }
    }

    function showCurrentFund() public view returns(uint) {
        return address(this).balance;
    }

    function withdrawTotalFund(address payable _to) public onlyOwner {
        _to.transfer(address(this).balance);
    }
}