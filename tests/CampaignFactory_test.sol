// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "../contracts/CampaignFactory.sol";

contract CampaignFactoryTest {
   
    CampaignFactory campaignFactoryToTest;
    function beforeAll () public {
        campaignFactoryToTest = new CampaignFactory();
    }
    
    function checkCreateCampaign () public {
        string memory image = "https://www.bing.com/images/search?view=detailV2&ccid=7qeEY9Xl&id=96544BB4EE5B1E54739254C3146A50730E80C22B&thid=OIP.7qeEY9Xlu7r1UEmFuT9w9AHaFj&mediaurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.eea78463d5e5bbbaf5504985b93f70f4%3frik%3dK8KADnNQahTDVA%26riu%3dhttp%253a%252f%252fimages6.fanpop.com%252fimage%252fphotos%252f34300000%252fKitten-cats-34352405-1600-1200.jpg%26ehk%3d%252bjVIdH7ZaPLWCoFD9qHpcR%252fMLuDeVtFcIH0TPW9qZB8%253d%26risl%3d%26pid%3dImgRaw%26r%3d0&exph=1200&expw=1600&q=cat&simid=608055352362037631&FORM=IRPRST&ck=FAF117604DEBD055FCFE58C5A4A87CB4&selectedIndex=0";
        campaignFactoryToTest.createCampaign(1, "First campaign", "This is my first campaign", image, 10);
        Campaign[] memory campaigns = campaignFactoryToTest.getDeployedCampaigns();
        Assert.equal(campaigns.length, uint(1), "should exists 1 campaign");
        Assert.equal(campaigns[0].minimumPayment(), uint(1), "minimum payment should be equal to 1");
        Assert.equal(campaigns[0].campaignName(), "First campaign", "Wrong campaign name");
        Assert.equal(campaigns[0].campaignDescription(), "This is my first campaign", "Wrong campaign description");
        Assert.equal(campaigns[0].imageUrl(), image, "Wrong image url");
        Assert.equal(campaigns[0].targetAmount(), uint(10), "Wrong target amount");
        Assert.equal(campaigns[0].minimumPayment() <= campaigns[0].targetAmount(), true, "minimumPayment should be less then target amount");
        //Assert.equal(campaigns[0].campaignManager(), msg.sender, "Wrong campaign manager");
    }
}