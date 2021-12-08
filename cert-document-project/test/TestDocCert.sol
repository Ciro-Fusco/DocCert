pragma solidity ^0.8.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/DocCert.sol";

contract TestDocCert{
 // The address of the adoption contract to be tested
 DocCert doc = DocCert(DeployedAddresses.DocCert());

 // The fake info of the document that will be used for testing
 string test_cid = "CidDiProva" ;
 string test_hash = "1234567890abcdef123456" ;

 //The expected owner of the document is this contract
 address[] expectedOwner;
 // Testing the addFile() function
 function testDocumentCanBeAdded() public {
   //Adding first owner to array
   expectedOwner.push(address(this));
   
   
   doc.addFile(test_hash, test_cid);

   //Assert.isTrue(super.listCertFile[test_hash].exist,"Contract return that document doesn't exists");
   //Assert.equal(super.listCertFile[test_hash].cid, test_cid, "Document CID should be test_cid but is not.");
 }
 // Testing Verifica of a document
 function testVerifica() public {
   (string memory s, address[] memory a, , ) = doc.verifica(test_hash);
 
   Assert.equal(s, "", "Cid returned should be \"\" but  is not!");
   Assert.equal(a, expectedOwner, "Owners should be equal but are not!");
    }
 // Testing setOwner of a Document
 function testSetOwner() public {
   expectedOwner.push(address(0x00000000000000000002113400000000));
   doc.setOwner(test_hash,address(0x00000000000000000002113400000000));
    
   //Assert.equal(expectedOwner,super.listCertFile[test_hash].owner, "Owners of the document should be the same as defined here but are not");
  }
  
  //Testing getCid of a Document
   function testDocumentGetCid() public {
   string memory m = doc.getCid(test_hash);

   Assert.equal(m, test_cid, "Document CID should be test_cid but is not.");
 }
}
