import JSZip from 'jszip';
import https from "https";

export default async function handler(req, res) {
    const { data } = req.body;

    const proms = [];

    const doRequest = () => {
        return new Promise(function (resolve, reject) {
            for (let i = 0; i < data.length; i++) {
                https.get(data[i].link, (res) => {
                    const innerData = [];

                    res.on("data", (chunk) => {
                        innerData.push(chunk);
                    }).on("end", () => {
                        let buffer = Buffer.concat(innerData);
                        proms.push({ buff: buffer, title: data[i].title });
                        if (proms.length === data.length) {
                            resolve("done");
                        }
                    }).on("error", (err) => reject(err));
                });
            }
        });
    }
    
    try {
        await doRequest();

        const zip = new JSZip();
        const fold = zip.folder('songs');

        proms.forEach(d => {
            let parsedTitle = d.title.replaceAll("/", "");
            fold.file(`${parsedTitle}.mp3`, d.buff, { binary: true });
        });

        await zip.generateAsync({ type: "base64" }).then(content => {
            res.setHeader('Content-Disposition', `attachment; filename="archive.zip"`);
            res.setHeader('Content-Type', 'application/zip');
            res.send(content);
        });
    } catch(err) {
        if (err) res.status(500).send("Unexpected error occured, try again");
    }
}