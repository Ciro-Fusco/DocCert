// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DocCert is AccessControl{

    struct Record {
        bool exist;
        string cid;
        address[] owner;
        uint timestamp;
        uint blockNumber;
    }

    mapping(string => Record) private listCertFile;

    constructor(){}
    

    function addFile(string memory  hashFile, string memory cidFile) public
    {
       require(!listCertFile[hashFile].exist);       
    
        listCertFile[hashFile].exist=true;
        listCertFile[hashFile].cid=cidFile;
        listCertFile[hashFile].owner.push(msg.sender);
        listCertFile[hashFile].timestamp = block.timestamp;
        listCertFile[hashFile].blockNumber = block.number;


        bytes32 hashRole = bytes32(bytes(hashFile));
        _grantRole(hashRole,msg.sender);
    }

    function verifica(string memory  hashFile) public view  returns (string memory, address[] memory, uint, uint )
    {   

        require(listCertFile[hashFile].exist);
        return ("",listCertFile[hashFile].owner,listCertFile[hashFile].timestamp,listCertFile[hashFile].blockNumber);
    }

    function setOwner(string memory   hashFile,address newAddress) public
    {   
        bytes32 hashRole = bytes32(bytes(hashFile));
        require(hasRole(hashRole,msg.sender));
        listCertFile[hashFile].owner.push(newAddress);
        _grantRole(hashRole,newAddress);
    }

    function getCid(string memory   hashFile) public view  returns (string memory)
    {   
        bytes32 hashRole = bytes32(bytes(hashFile));
        require(hasRole(hashRole,msg.sender));
        return listCertFile[hashFile].cid;
    }


}
