describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketPlace");
    const nftMarketplace = await NFTMarketplace.deploy();
    await nftMarketplace.deployed();

    let listingPrice = await nftMarketplace.getListingPrice();

    console.log(nftMarketplace.signer.address);

    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("1", "ether");

    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com3",
      auctionPrice,
      { value: listingPrice }
    );

    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com2",
      auctionPrice,
      { value: listingPrice }
    );

    await nftMarketplace.createToken(
      "https://www.mytokenlocation.com1",
      auctionPrice,
      { value: listingPrice }
    );

    const [_, buyerAddress] = await ethers.getSigners();

    console.log(buyerAddress.address);

    console.log(listingPrice);

    // /* execute sale of token to another user */
    await nftMarketplace
      .connect(buyerAddress)
      .createMarketSale(2, { value: auctionPrice });

    /* resell a token */
    await nftMarketplace
      .connect(buyerAddress)
      .resellToken(2, auctionPrice, { value: listingPrice });

    // /* query for and return the unsold items */
    items = await nftMarketplace.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nftMarketplace.getTokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
});
