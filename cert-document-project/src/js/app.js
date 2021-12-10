
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try 
    {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } 
    catch (error) 
    {
    // User denied account access...
    console.error("User denied account access")
    alert("Accesso all'account negato dall'utente")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  } 
  web3 = new Web3(App.web3Provider);
    return App.initContract();
  },


  initContract: function() {
    $.getJSON('DocCert.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var DocCertArtifact = data;
      App.contracts.DocCert = TruffleContract(DocCertArtifact);
    
      // Set the provider for our contract
      App.contracts.DocCert.setProvider(App.web3Provider);
    
    });

    return App.bindEvents();
  },

  bindEvents: function() {
   
  },

  //AGGIUNTA DOCUMENTO 
  handleInvioDoc: async function(event) {

    var {cid,hash} = await invioDoc()

    var docCertInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
      alert("Non è stato possibile recuperare le informazioni sull'account");
  }

  var account = accounts[0];

  App.contracts.DocCert.deployed().then(function(instance) {
    docCertInstance = instance;

    return docCertInstance.addFile(hash.toString(),cid.path.toString(), {from: account});

  }).then(function(result) {
    document.getElementById("containerInfo").hidden=false;
    document.getElementById("CidText").innerHTML="CID : "+ cid.path;
    document.getElementById("hashText").innerHTML="Hash : "+ hash;
  }).catch(function(err) {
    console.log(err.message);
    alert("Non è stato possibile aggiungere il documento all BlockChain.")
  });
});
  },


  //VERIFICA DOCUMENTO
  handleVerDoc: async function(event) {
 

    var hash = await calcolaHashFile()

    var docCertInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
      alert("Non è stato possibile recuperare le informazioni sull'account");
  }

  var account = accounts[0];

  App.contracts.DocCert.deployed().then(function(instance) {
    docCertInstance = instance;

    return docCertInstance.verifica(hash, {from: account});

  }).then(function(result) {
      console.log(result)
      document.getElementById("containerInfo").hidden=false;
      document.getElementById("hashText").innerHTML = "Hash : " + hash;
      document.getElementById("addressText").innerHTML ="Address : " + result[1].toString().replaceAll(",","\n");

      var date = new Date(result[2].c[0]*1000);
      let hours = date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      let formattedTime =date.getDate()+"/"+date.getMonth()+ "/"+ date.getFullYear() + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) +" " ;

      document.getElementById("TimeStampText").innerHTML ="TimeStamp : " + formattedTime;
      document.getElementById("BlockNumberText").innerHTML = "BlockNumber : "+result[3].c[0];
  }).catch(function(err) {
    console.log(err.message);
    alert("Non è stato possibile verificare il documento");
  });
});
  },


  //AGGIUNTA PROPRIETARIO
  handleAddProp: function(event) {
    
    let hash = document.getElementById("hashInput").value
    let newAdress = document.getElementById("addressInput").value

    if(/^0x[0-9a-f]{40}/.exec(newAdress.toLowerCase()))
    {
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
          alert("Non è stato possibile recuperare le informazioni sull'account");
      }
    
      var account = accounts[0];
    
      App.contracts.DocCert.deployed().then(function(instance) {
        docCertInstance = instance;
    
        return docCertInstance.setOwner(hash,newAdress, {from: account});
    
      }).then(function(result) {
          console.log(result)
      }).catch(function(err) {
        console.log(err.message);
        alert("Non è stato possibile modificare le informazioni sul documento");
      });
    });
    }
    else
    {
      console.log("Address non valido")
      alert("Indirizzo non valido");
    }
  },

  //OTTIENI CID DOCUMENTO
  handleGetCid: function(event) {

    let hash = document.getElementById("hashInput").value

    var docCertInstance;

  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
      alert("Non è stato possibile recuperare le informazioni sull'account");
  }

  var account = accounts[0];

  App.contracts.DocCert.deployed().then(function(instance) {
    docCertInstance = instance;

    return docCertInstance.getCid(hash, {from: account});

  }).then(function(result) {
    console.log(result)
    document.getElementById("containerInfo").hidden=false;
    document.getElementById("cidText").innerHTML = "CID : " + result;
  }).catch(function(err) {
    console.log(err.message);
    alert("Non è stato possibile ottenere il CID del documento");
  });
});
  }

};

$(function() {
  $(document).ready(function() {
    App.init();
  });
});
