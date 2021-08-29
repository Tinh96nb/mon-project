// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IMonNFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/IMonMarketPlace.sol";
import "./MonBase.sol";

contract MonMarketPlace is MonBase, IMonMarketPlace{
    struct MarketHistory{
        address buyer;
        address seller;
        uint256 price;
        uint256 time;
    }
    
    uint256[] internal _tokens;
    
    //Mapping tokenId to token price
    mapping(uint256 => uint256) internal _tokenPrices;
    
    //Mapping tokenId to owner of tokenId
    mapping(uint256 => address) internal _tokenOwners;
    
    //Mapping tokenId to market
    mapping(uint256 => MarketHistory[]) internal _marketHistories;
    
    constructor(address monTokenAddress, address monNFTAddress) 
        MonBase(monTokenAddress, monNFTAddress){}
    
    /**
     * @dev Create a sell order to sell NFT
     */
    function createSellOrder(uint256 tokenId, uint256 price) external override returns(bool){
        //Validate
        require(_tokenOwners[tokenId] == address(0), "Can not create sell order for this token");
        IMonNFT monNFT = getMonNFT();
        
        address tokenOwner = monNFT.ownerOf(tokenId);
        require(tokenOwner == _msgSender(), "Forbidden to create sell NFT");
        
        //Transfer monNFT to this contract
        monNFT.safeTransferFrom(tokenOwner, address(this), tokenId);
        
        _tokenOwners[tokenId] = tokenOwner;
        _tokenPrices[tokenId] = price;
        _tokens.push(tokenId);
        
        emit NewSellOrderCreated(_msgSender(), _now(), tokenId, price);
        
        return true;
    }
    
    /**
     * @dev User that created sell order can cancel that order
     */ 
    function cancelSellOrder(uint256 tokenId) external override returns(bool){
        require(_tokenOwners[tokenId] == _msgSender(), "Forbidden to cancel sell order");

        IMonNFT monNFT = getMonNFT();
        //Transfer monNFT from contract to sender
        monNFT.safeTransferFrom(address(this), _msgSender(), tokenId);
        
        _tokenOwners[tokenId] = address(0);
        _tokenPrices[tokenId] = 0;
        _tokens = _removeFromTokens(tokenId);
        
        return true;
    }
    
    /**
     * @dev Get all active tokens that can be purchased 
     */ 
    function getTokens() external view returns(uint256[] memory){
        return _tokens;
    }
    
    /**
     * @dev Get token info about price and owner
     */ 
    function getTokenInfo(uint tokenId) external view returns(address, uint){
        return (_tokenOwners[tokenId], _tokenPrices[tokenId]);
    }
    
    
    function getMarketHistories(uint256 tokenId) external view returns(MarketHistory[] memory){
        return _marketHistories[tokenId];
    }
    
    /**
     * @dev Get token price
     */ 
    function getTokenPrice(uint256 tokenId) external view returns(uint){
        return _tokenPrices[tokenId];
    }
    
    /**
     * @dev Get token's owner
     */ 
    function getTokenOwner(uint256 tokenId) external view returns(address){
        return _tokenOwners[tokenId];
    }
    
    /**
     * @dev User purchases a nft
     */ 
    function purchase(uint tokenId) external override returns(uint){
        address tokenOwner = _tokenOwners[tokenId];
        require(tokenOwner != address(0),"Token has not been added");
        
        uint256 tokenPrice = _tokenPrices[tokenId];
        
        if(tokenPrice > 0){
            IERC20 monTokenContract = getMonToken();    
            require(monTokenContract.transferFrom(_msgSender(), address(this), tokenPrice));
            uint256 feeAmount = 0;
            // fee for owner
            uint256 feePercent = getFeePercent();
            if(feePercent > 0){
                feeAmount = tokenPrice * feePercent / 100 / MULTIPLIER;
                require(monTokenContract.transfer(_owner, feeAmount));
            }
            // fee for author
            uint256 feeCopyright = 0;
            IMonNFT monNFT = getMonNFT();
            address author = monNFT.getTokenAuthor(tokenId);
            uint256 feePercentCopyright = monNFT.getFeeCopyright(tokenId);
            if (feePercentCopyright > 0) {
                feeCopyright = tokenPrice * feePercentCopyright / 100 / MULTIPLIER;
                require(monTokenContract.transfer(author, feeCopyright));
            }
            // transfer token for owner nft
            require(monTokenContract.transfer(tokenOwner, tokenPrice - feeAmount - feeCopyright));
        }
        
        //Transfer monNFT from contract to sender
        getMonNFT().transferFrom(address(this),_msgSender(), tokenId);
        
        _marketHistories[tokenId].push(MarketHistory({
            buyer: _msgSender(),
            seller: _tokenOwners[tokenId],
            price: tokenPrice,
            time: block.timestamp
        }));
        
        _tokenOwners[tokenId] = address(0);
        _tokenPrices[tokenId] = 0;
        _tokens = _removeFromTokens(tokenId);
        
        emit Purchased(_msgSender(), tokenId, tokenPrice);
        
        return tokenPrice;
    }
    
    /**
     * @dev Remove token item by value from _tokens and returns new list _tokens
    */ 
    function _removeFromTokens(uint tokenId) internal view returns(uint256[] memory){
        uint256 tokenCount = _tokens.length;
        uint256[] memory result = new uint256[](tokenCount-1);
        uint256 resultIndex = 0;
        for(uint tokenIndex = 0; tokenIndex < tokenCount; tokenIndex++){
            uint tokenItemId = _tokens[tokenIndex];
            if(tokenItemId != tokenId){
                result[resultIndex] = tokenItemId;
                resultIndex++;
            }
        }
        
        return result;
    }
    
    event NewSellOrderCreated(address indexed seller, uint256 time, uint256 tokenId, uint256 price);
    event Purchased(address indexed buyer, uint256 tokenId, uint256 price);
}