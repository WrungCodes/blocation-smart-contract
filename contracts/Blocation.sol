// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// blocation-contract/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blocation is ERC721 {
    using Counters for Counters.Counter;

    Counters.Counter private currentTokenId;
    Counters.Counter public totalTokenSuppy;

    mapping(uint256 => string) private locations;

    constructor() ERC721("Blocation", "BLCTN") {}

    function createBlocation(
        string memory _tag,
        string memory _long,
        string memory _lat
    ) public {
        currentTokenId.increment();
        totalTokenSuppy.increment();
        _safeMint(
            _msgSender(),
            currentTokenId.current(),
            abi.encodePacked(_tag, "|", _long, "|", _lat)
        );
        locations[currentTokenId.current()] = string(
            abi.encodePacked(_tag, "|", _long, "|", _lat)
        );
    }

    function getBlocation(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        require(_exists(_tokenId), "ERC721: query for nonexistent token");
        require(
            ownerOf(_tokenId) == _msgSender(),
            "ERC721: token doesn't belong to you"
        );
        return locations[_tokenId];
    }

    function transferBlocation(address to, uint256 _tokenId) public {
        safeTransferFrom(_msgSender(), to, _tokenId);
    }

    function blocationsOfOwner() external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_msgSender());

        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalBlocTokens = currentTokenId.current();
            uint256 resultIndex = 0;

            uint256 _tokenId;

            for (_tokenId = 1; _tokenId <= totalBlocTokens; _tokenId++) {
                if (_exists(_tokenId)) {
                    if (ownerOf(_tokenId) == _msgSender()) {
                        result[resultIndex] = _tokenId;
                        resultIndex++;
                    }
                }
            }

            return result;
        }
    }
}
