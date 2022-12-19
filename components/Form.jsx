"use client";

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

    const handleDownload = (e) => {
        e.preventDefault();
        // if (urls.length > 0) {
        //     urls.forEach(async e => {
        //         const options = {
        //             method: 'GET',
        //             url: "https://youtube-mp36.p.rapidapi.com/dl",
        //             params: {id: e},
        //             headers: {
        //               'X-RapidAPI-Key': process.env.NEXT_PUBLIC_KEY,
        //               'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        //             }
        //         }
        //         let result;
        //         try {
        //             // result = await fetchData(options);
        //             // console.log(result);
        //             const req = await axios.post("/api/hello", { data: ["https://malpha.123tokyo.xyz/get.php/6/14/0xyxtzD54rM.mp3?cid=MmEwMTo0Zjg6YzAxMDo5ZmE2OjoxfE5BfERF&h=ftCTJqqodhM8AEu4v7kidg&s=1671404694&n=Given%20Up%20%5BOfficial%20Music%20Video%5D%20-%20Linkin%20Park",
        //             "https://mgamma.123tokyo.xyz/get.php/d/96/yoCD5wZEgo4.mp3?cid=MmEwMTo0Zjg6YzAxMDo5ZmE2OjoxfE5BfERF&h=AUzoC1TFXxHkgs-B3S4VzA&s=1671404694&n=Points%20Of%20Authority%20-%20Linkin%20Park%20%28Hybrid%20Theory%29"] });
        //             console.log(req);
        //         } catch(err) {
        //             setError("Failed to download one of the videos, try again with different url.");
        //         }
        //     });
        // }
        const download = (itemname, item) => {
            return axios.get(item, { responseType: "blob", headers: {"Access-Control-Allow-Origin": "*"} }).then((res) => {
                zip.file(itemname, res.data);
                zip.generateAsync({type: "blob"}).then(content => {
                    saveAs(content, "example.zip");
                })
            });
        }

        download("a7x.mp3", "https://mdelta.123tokyo.xyz/get.php/c/79/-c7sU6eVNLM.mp3?cid=MmEwMTo0Zjg6YzAxMDo5ZmE2OjoxfE5BfERF&h=lG3opGs04BQ8PS9dtVa5GA&s=1671412440&n=Avenged%20Sevenfold%20-%20This%20Means%20War%20%28Alternate%20Music%20Video%29");
    }

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

    // useEffect(() => {
    //     const urls = localStorage.getItem("urls");
    //     const parsedUrls = urls ? JSON.parse(urls) : null;

    //     if (parsedUrls) setUrls(parsedUrls);
    // }, [window]);
     
    return (
        <>
            {error !== "" && 
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                    <span className="font-medium">Error occured!</span> {error}
                </div>
            }
            <div className="shadow-2xl w-full max-w-2xl dark:bg-slate-700 rounded">
                <form className="rounded px-8 p-8">
                    <div className="relative mb-5">
                        <input ref={urlRef} type="text" id="default-text" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Place urls here..." />
                        <button onClick={(e) => handleInputBlur(e)} className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 bg-blue-700">Add</button>
                    </div>
                    <button className="dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center m-auto">
                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                        <span onClick={(e) => handleDownload(e)}>Download</span>
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

export default Form;