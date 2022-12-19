import axios from "axios";
import { useState, useEffect, useRef } from "react";
import ListItems from "./ListItems";

import { saveAs } from "file-saver";
import JSZip from "jszip";
const zip = new JSZip();

const Form = () => {
    const urlRef = useRef(null);
    const [urls, setUrls] = useState([]);
    const [error, setError] = useState("");
    const [mp3Data, setMP3Data] = useState([]);
    const [downloading, setDownloading] = useState(false);

    const reg = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g;
    const id = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/;
    
    const handleInputBlur = (e) => {
        e.preventDefault();
        const val = urlRef.current.value;
        if (val === "" || val.trim() === "") return;
        const parseID = val.match(id)[1];
        if (urls.includes(parseID) || !reg.test(val)) return;
        setUrls((prev) => ([...prev, parseID]));
    }

    const handleRemoveUrl = (url) => {
        const newArr = urls.filter(e => e !== url);
        setUrls(newArr);

        if (newArr.length === 0) localStorage.removeItem("urls");
    }

    const handleDownload = async (e) => {
        e.preventDefault();
        if (!downloading && urls.length > 0) {
            setDownloading(true);
            urls.forEach(async e => {
                const options = {
                    method: 'GET',
                    url: "https://youtube-mp36.p.rapidapi.com/dl",
                    params: {id: e},
                    headers: {
                      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_KEY,
                      'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
                    }
                }
                let result;
                result = await fetchData(options);
                setMP3Data((prev) => [...prev, { link: result.link, title: result.title }]);
            });
        }
    }

    useEffect(() => {
        if (urls.length === mp3Data.length && urls.length !== 0) {
            const fetchzipfile = async () => {
                try {
                    const req = await axios.post("/api/tozip", { data: mp3Data });
                    const data = await req.data;

                    const b64toFile = (b64Data, filename, contentType) => {
                        var sliceSize = 512;
                        var byteCharacters = atob(b64Data);
                        var byteArrays = [];
                    
                        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                            var slice = byteCharacters.slice(offset, offset + sliceSize);
                            var byteNumbers = new Array(slice.length);
                    
                            for (var i = 0; i < slice.length; i++) {
                                byteNumbers[i] = slice.charCodeAt(i);
                            }
                            var byteArray = new Uint8Array(byteNumbers);
                            byteArrays.push(byteArray);
                        }
                        var file = new File(byteArrays, filename, {type: contentType});
                        return file;
                    }
                    saveAs(b64toFile(data, "default.txt", "application/zip"), "mp3tozip.zip");
                    setDownloading(false);
                } catch(err) {
                    setError("Failed to download one of the videos, try again with different url.");
                    setDownloading(false);
                }
            }
            fetchzipfile();
        }
    }, [mp3Data]);

    const fetchData = async (options) => {
        try {
            const req = await axios.request(options);
            const res = await req.data;
            return res;
        } catch(err) {
            if (err) throw err;
        }
    }

    useEffect(() => {
        urlRef.current.value = "";
        if (urls.length !== 0) localStorage.setItem("urls", JSON.stringify(urls));
    }, [urls]);

    useEffect(() => {
        const urls = localStorage.getItem("urls");
        const parsedUrls = urls ? JSON.parse(urls) : null;

        if (parsedUrls) setUrls(parsedUrls);
    }, []);
     
    return (
        <>
            {error !== "" && 
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 absolute top-10" role="alert">
                    <span className="font-medium">Error occured!</span> {error}
                </div>
            }
            <div className="shadow-2xl w-full max-w-2xl dark:bg-slate-700 rounded">
                <form className="rounded px-8 p-8">
                    <div className="relative mb-5">
                        <input ref={urlRef} type="text" id="default-text" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Place urls here..." />
                        <button onClick={(e) => handleInputBlur(e)} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 bg-blue-700">Add</button>
                    </div>
                    <button onClick={(e) => handleDownload(e)} className={`${downloading ? 'pointer-events-none dark:bg-blue-400 dark:hover:bg-blue-400 bg-blue-600 hover:bg-blue-600': ''} dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center m-auto`}>
                        { downloading ? <Spinner /> :
                            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg> 
                        }
                        <span>Download</span>
                    </button>
                </form>
                {
                    urls.length > 0 &&
                    <div className="flex justify-center max-h-60 overflow-y-auto rounded-b-lg">
                        <ul className="dark:bg-slate-700 bg-white w-full text-gray-900">
                            {urls.map((e, i) => {
                                return <ListItems emitRemove={handleRemoveUrl} key={i} url={e} />
                            })}
                        </ul>
                    </div>
                }
            </div>
        </>
    )
}

const Spinner = () => {
    return (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )
}

export default Form;