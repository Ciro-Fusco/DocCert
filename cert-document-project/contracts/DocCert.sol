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

    constructor(){}
    

    function addFile(string memory hashFile, string memory cidFile) public  
    {
        require(!listCertFile[hashFile].exist);

        address[] memory addArray;
        addArray[0]=msg.sender;
        
        Record storage r = Record (true,cidFile,addArray,block.timestamp,block.number); // storage al posto di memory perchè il record deve esistere al termine della chiamata
        listCertFile[hashFile] = r;
        bytes32 hashRole = bytes32(bytes(hashFile));
        ac.grantRole(hashRole,msg.sender);
    }

    function verifica(string memory hashFile) public view returns (string memory , address[] memory, uint , uint )
    {   

        require(listCertFile[hashFile].exist);
        Record memory r;
        r = listCertFile[hashFile];
        return ("",listCertFile[hashFile].owner,listCertFile[hashFile].timestamp,listCertFile[hashFile].blockNumber);
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
