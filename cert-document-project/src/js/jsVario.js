drop_zone.ondragover = drop_zone.ondragenter = function(evt) {
    evt.preventDefault();
  };
  
  drop_zone.ondrop = function(evt) {
    document.getElementById("azione").innerHTML="File selezionato :" + evt.dataTransfer.files[0].name
    console.log(evt.dataTransfer.files[0]);
    evt.preventDefault();
    // pretty simple -- but not for IE :(
    fileInput.files = evt.dataTransfer.files;
  
    // If you want to use some of the dropped files
    const dT = new DataTransfer();
    dT.items.add(evt.dataTransfer.files[0]);
    fileInput.files = dT.files;
  
    evt.preventDefault();
  };
  
 function invioDoc()
 {
    console.log(fileInput.files);
 }