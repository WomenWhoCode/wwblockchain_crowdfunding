// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title CampaignFactory
 * @dev Store & retrieve Crowdfunding campaigns in a variable
 */
contract CampaignFactory {

    Campaign[] public deployedCampaigns;

    function createCampaign(uint minimum, string memory name, string memory description, string memory image, uint target) public {
        Campaign newCampaign = new Campaign(minimum, name, description, image, target);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
    
}

contract Campaign {

    uint public minimumPayment;
    address public campaignManager;
    string public campaignName;
    string public campaignDescription;
    string public imageUrl;
    uint public targetAmount;
    bool public complete;


    constructor(uint minimum, string memory name, string memory description, string memory image, uint target) {
        minimumPayment = minimum;
        campaignManager = msg.sender;
        campaignName = name;
        campaignDescription = description;
        imageUrl = image;
        targetAmount = target;
        complete = false;
    }
}