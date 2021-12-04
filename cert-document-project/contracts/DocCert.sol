// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DocCert {

    struct Record {
        bool exist;
        string cid;
        address[] owner;
        uint timestamp;
        uint blockNumber;
    }
	
    AccessControl private ac;
    mapping(string => Record) private listCertFile;
    

    constructor(string memory hashFile, string memory cidFile)
    {
        require(!listCertFile[hashFile].exist);

        address[] memory addArray;
        addArray[0]=msg.sender;
        Record memory r = Record (true,cidFile,addArray,block.timestamp,block.number);
        listCertFile[hashFile] = r;

        bytes32 hashRole = bytes32(bytes(hashFile));
        ac.grantRole(hashRole,msg.sender);
    }

    function verifica(string memory hashFile) public view returns (Record memory)
    {   

        require(listCertFile[hashFile].exist);
        Record memory r;
        r = listCertFile[hashFile];
        Record memory r2 = Record (listCertFile[hashFile].exist,"",listCertFile[hashFile].owner,listCertFile[hashFile].timestamp,listCertFile[hashFile].blockNumber);
        return r2;
    }

    function setOwner(string memory hashFile,address newAddress) public
    {   
        bytes32 hashRole = bytes32(bytes(hashFile));
        require(ac.hasRole(hashRole,msg.sender));
        listCertFile[hashFile].owner.push(newAddress);
        ac.grantRole(hashRole,newAddress);
    }

    function getCid(string memory hashFile) public view  returns (string memory)
    {   
        bytes32 hashRole = bytes32(bytes(hashFile));
        require(ac.hasRole(hashRole,msg.sender));
        return listCertFile[hashFile].cid;
    }


}
