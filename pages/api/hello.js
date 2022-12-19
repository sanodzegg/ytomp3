// import { saveAs } from 'file-saver';
// import JSZip from 'jszip';
// import AdmZip from 'adm-zip';
// import zipStream from 'zip-stream';

// import fs from "fs"
// import https from "https";
// import request from 'request';

// export default function handler(req, res) {
//   const zp = new AdmZip();

//   const url = "https://mdelta.123tokyo.xyz/get.php/c/79/-c7sU6eVNLM.mp3?cid=MmEwMTo0Zjg6YzAxMDo5ZmE2OjoxfE5BfERF&h=lG3opGs04BQ8PS9dtVa5GA&s=1671412440&n=Avenged%20Sevenfold%20-%20This%20Means%20War%20%28Alternate%20Music%20Video%29";
  
//   // res.set('Content-Type','application/octet-stream');
//   // res.set('Content-Disposition',`attachment; filename=${file_after_download}`);
//   // res.set('Content-Length',data.length);

//   // const request = https.get(url, (response) => {
//   //   // response.pipe(file);
//   //   console.log(response);
//   // });
//   const archive = new zipStream();

//   archive.on('error', function(err) {
//     throw err;
//   });

//   const stream = request("https://loremflickr.com/640/480");

//   archive.entry(stream, { name: '2.jpg' }, (err, entry) => {
//     if (err) throw err;
//     console.log(entry);
//   });

//   archive.finalize();

//   archive.pipe(res);

// }