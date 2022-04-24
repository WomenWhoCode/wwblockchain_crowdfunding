// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title CampaignFactory
 * @dev Store & retrieve Crowdfunding campaigns in a variable
 */
contract CampaignFactory {

    Campaign[] public deployedCampaigns;

    function createCampaign(uint minimumFund, string memory name, string memory description, string memory image, uint targetFund) public {
        Campaign newCampaign = new Campaign(minimumFund, name, description, image, targetFund);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
    
}

contract Campaign {

    uint public minimumPayment;
    address public campaignOwner;
    string public campaignName;
    string public campaignDescription;
    string public imageUrl;
    uint public targetAmount;
    bool public complete;
    uint public fundReceivedSoFar;


    constructor(uint minimumFund, string memory name, string memory description, string memory image, uint targetFund) {
        minimumPayment = minimumFund;
        campaignOwner = msg.sender;
        campaignName = name;
        campaignDescription = description;
        imageUrl = image;
        targetAmount = targetFund;
        complete = false;
    }

    modifier onlyOwner() {
        require(msg.sender == campaignOwner, "Action is only available to campaign's owner.");
        _;
    }

    function receiveFund() public payable {
        fundReceivedSoFar += msg.value;
    }

    function showCurrentFund() public view returns(uint) {
        return address(this).balance;
    }

    function withdrawTotalFund(address payable _to) public onlyOwner {
        _to.transfer(address(this).balance);
    }
}