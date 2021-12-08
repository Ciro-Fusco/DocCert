

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
  
  async function invioDoc()
 {
    const node = await Ipfs.create({ repo: 'ipfs-' + Math.random() })
    const cid = await node.add(fileInput.files[0]);
    let hash= buf2hex(cid.cid.multihash.digest)

    return {cid,hash}

 }

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

 async function calcolaHashFile()
{
  const node = await Ipfs.create({ repo: 'ipfs-' + Math.random() })
  const cid = await node.add(fileInput.files[0],{onlyHash:true});
  let hash= buf2hex(cid.cid.multihash.digest)
  return hash;
}
