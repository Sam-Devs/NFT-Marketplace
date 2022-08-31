// SPDX-License-Identifier: UNLICENSE-2.0
pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";

import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";


import "@openzeppelin/contracts/utils/Counters.sol";


contract NFTMarketPlace is ERC721A, IERC721Receiver{

    using Counters for Counters.Counter;
    
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether;

    uint256 defaultMintQuantity = 1;
    
    address payable owner;

    address baseContract;

    mapping(uint256 => MarketItem) private idToMarketItem;

    mapping(uint256 => string) private tokenURIToItem;

    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
    }

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold
    );

    constructor() ERC721A("SmaFet Token", "SMAFET") {
        owner = payable(msg.sender);
    }

    function _setTokenURI(uint256 newTokenId, string memory tokenURI) private {
        tokenURIToItem[newTokenId] = tokenURI;
    }

    function _startTokenId() internal override pure returns (uint256){
      return 1;
    }
      /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "ERR-1.0.1: Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

      /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4){
      return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }

       /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
     
      uint256 newTokenId = _nextTokenId();

      _safeMint(msg.sender, defaultMintQuantity);

      _setTokenURI(newTokenId, tokenURI);
      
      createMarketItem(newTokenId, price);
      
      return newTokenId;
    }

     function createMarketItem(
      uint256 tokenId,
      uint256 price
    ) private {
      require(price > 0, "ERR-1.0.2:Price must be at least 1 wei");
      require(msg.value == listingPrice, "ERR-1.0.3:Price must be equal to listing price");

      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false
      );

    safeTransferFrom(msg.sender, address(this),tokenId);

      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        price,
        false
      );

    }
    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
      require(idToMarketItem[tokenId].owner == msg.sender, "ERR-1.0.4: Only item owner can perform this operation");
      require(msg.value == listingPrice, "ERR-1.0.5: Price must be equal to listing price");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].price = price;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this)); //new owner of the cryptoAsset
      _itemsSold.decrement();

      safeTransferFrom(msg.sender, address(this),tokenId);
    }
        /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
      require(msg.value == price, "ERR-1.0.6: Please submit the asking price in order to complete the purchase");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      _itemsSold.increment();

      /**
        Owner (MarketPlace contract should approve the buyer's address in other to initiate sucessful purchase of NFT
       */
      // Approve Buyer before transfering token to buyer's wallet
      (bool success, ) = address(this).call(abi.encodeWithSignature("approve(address,uint256)", msg.sender, tokenId));

      require(success, "ERR-1.0.7: Cannot approve buyer");

      safeTransferFrom(address(this), msg.sender,tokenId);
      
      payable(owner).transfer(listingPrice); //transfer the listing price to the contract owner
      payable(seller).transfer(msg.value);
    }

       /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _nextTokenId();
      uint unsoldItemCount = _nextTokenId() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _nextTokenId();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

     /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _nextTokenId();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    function getTokenURI (uint256 _tokenURI) external view returns (string memory){
        return tokenURIToItem[_tokenURI];
    }
}
