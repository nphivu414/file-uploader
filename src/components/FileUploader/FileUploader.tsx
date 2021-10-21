// https://api.video/blog/tutorials/uploading-large-files-with-javascript
import * as React from 'react';
import { useDropzone } from 'react-dropzone';

type FileUploaderProps = {}

const CHUNK_SIZE = 1000

const input = document.querySelector('#video-url-example');
const url ="https://sandbox.api.video/upload?token=to1R5LOYV0091XN3GQva27OS";
let chunkCounter: number;
//break into 5 MB chunks fat minimum
const chunkSize = 6000000;  
const videoId = "";
const playerUrl = "";

const FileUploader: React.FC<FileUploaderProps> = () => {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const disabled = acceptedFiles.length === 0;
  const file = acceptedFiles[0];
  const filename = file.name;
  const numberofChunks = Math.ceil(file.size/CHUNK_SIZE);

  function uploadChunk(chunkForm, start, chunkEnd){
    var oReq = new XMLHttpRequest();
    oReq.upload.addEventListener("progress", updateProgress);	
    oReq.open("POST", url, true);
    var blobEnd = chunkEnd-1;
    var contentRange = "bytes "+ start+"-"+ blobEnd+"/"+file.size;
    oReq.setRequestHeader("Content-Range",contentRange);
    console.log("Content-Range", contentRange);
  }

  function updateProgress (oEvent) {
    if (oEvent.lengthComputable) {  
    var percentComplete = Math.round(oEvent.loaded / oEvent.total * 100);

  var totalPercentComplete = Math.round((chunkCounter -1)/numberofChunks*100 +percentComplete/numberofChunks);
    document.getElementById("chunk-information").innerHTML = "Chunk # " + chunkCounter + " is " + percentComplete + "% uploaded. Total uploaded: " + totalPercentComplete +"%";
//	console.log (percentComplete);
  // ...
  } else {
    console.log ("not computable");
    // Unable to compute progress information since the total size is unknown
  }
}
  
  const createChunk = (videoId: string, start: number, end: number) => {
    chunkCounter++;
    let chunkEnd = start + CHUNK_SIZE;
    console.log("created chunk: ", chunkCounter);
    chunkEnd = Math.min(start + CHUNK_SIZE , file.size );
    const chunk = file.slice(start, chunkEnd);
    console.log("i created a chunk of video" + start + "-" + chunkEnd + "minus 1	");
    const chunkForm = new FormData();
    if(videoId.length >0){
      //we have a videoId
      chunkForm.append('videoId', videoId);
      console.log("added videoId");	
      
    }
        chunkForm.append('file', chunk, filename);
    console.log("added file");

    
    //created the chunk, now upload iit
    uploadChunk(chunkForm, start, chunkEnd);
  }

  const handleUpload = async () => {



    const formData = new FormData();
		formData.append('file', file);
    const res = await fetch(
			'http://localhost:4000/upload',
			{
				method: 'POST',
				body: formData,
			}
		)
    console.log("🚀 ~ file: FileUploader.tsx ~ line 35 ~ handleUpload ~ res", res)
  }

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>
          {acceptedFiles.map((file, i) => (
            <li key={i}>
              {file.name} - {file.size} bytes
            </li>
          ))}
        </ul>
      </aside>
      <div style={{ marginTop: 15 }}>
        <button disabled={disabled} className="button is-primary" onClick={handleUpload}>Upload</button>
      </div>
    </section>
  );
}

export default FileUploader
