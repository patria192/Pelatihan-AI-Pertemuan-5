//import dependency
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

//pertemua 5 ()
import path from "node:path";
import { fileURLToPath } from "node:url";

import 'dotenv/config';
import { config } from "dotenv";
import { error } from "node:console";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);


//pertemuan 5
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//inisiasi aplikasi

//deklarasi variable di javascript
//[const|let] [namaVariable] = [values]
//[var] --> ga dipake lagi setelah es2015 | es6
//karena [var] global variable & tidak boleh sama
//const 1x declare ga bisa dirubah-rubah lagi
//let 1x declare tapi bisa di reassigment

const app = express();
const upload = multer(); //akan digunakan dalam recording

const ai = new GoogleGenAI({}); //instantion mejadi object instance (oop (object oriented programming))

//inisiasi middleware
//contoh app.use(namaMiddleware)
app.use(cors()); //inisialisasi CORS (cross origin resource sharing) sebagai middleware
app.use(express.json()); //memanggil property didalam object

//pertemuan 5
app.use(express.static(path.join(__dirname, 'static')));
const dataBukuObject = require(path.join(__dirname,`knowledge/dataBuku.json`));

//inisialisasi routing
//contoh: app.get(), app.put(), app.post(), dll
//GET PUT POST itu standar request http methode
app.post('/generate-text', async (req, res) => {
    //terima jeroannya, lalu cek disini
    const { prompt } = req.body; //object desctructuring

    console.log({ prompt });

    //guard clause
    if(!prompt || typeof prompt !== 'string'){
        res.status(400).json({
            success: false,
            message: 'Prompt harus berupa string!',
            data: null
        });
        return
    }

    try {
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {text: prompt}
            ],
            //ini untuk config ai nya lebih jauh lagi
            config: {
                systemInstruction: 'Harus dibalas dalam bahasa Sunda'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Berhasil dijawab Gemini AI',
            data: aiResponse.text
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Sepertinya server sedang masalah',
            data: null
        })
    }
});

app.post('/generate-from-image', upload.single("image"), async (req, res) => {
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString("base64");

    try{
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {text: prompt, type: "text"},
                {inlineData: {
                    data: base64Image,
                    mimeType: req.file.mimetype
                }}
            ],
            config: {
                systemInstruction: "harus dibalas dengan bahasa indonesia"
            }
        });

        res.status(200).json({
            success: true,
            message: 'Berhasil dijawab Gemini AI',
            data: aiResponse.text
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Sepertinya server sedang masalah',
            data: null
        })
    }
})

app.post('/generate-from-document', upload.single("document"), async (req, res) => {
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString("base64");

    try{
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {text: prompt, type: "text"},
                {inlineData: {
                    data: base64Document,
                    mimeType: req.file.mimetype
                }}
            ],
            config: {
                systemInstruction: "harus dibalas dengan bahasa indonesia"
            }
        });

        res.status(200).json({
            success: true,
            message: 'Berhasil dijawab Gemini AI',
            data: aiResponse.text
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Sepertinya server sedang masalah',
            data: null
        })
    }
});

app.post('/generate-from-audio', upload.single("audio"), async (req, res) => {
    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString("base64");

    try{
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {text: prompt, type: "text"},
                {inlineData: {
                    data: base64Audio,
                    mimeType: req.file.mimetype
                }}
            ],
            config: {
                systemInstruction: "harus dibalas dengan bahasa indonesia"
            }
        });

        res.status(200).json({
            success: true,
            message: 'Berhasil dijawab Gemini AI',
            data: aiResponse.text
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Sepertinya server sedang masalah',
            data: null
        })
    }
});

app.post("/api/chat", async (req, res) => {
    const { conversation } = req.body;

    try{
        if(!Array.isArray(conversation)){
            res.status(400).json({
                success: false,
                message: "Conversation harus berupa array",
                data: null
            });
            return
        }

        let messageIsValid = "true";

        if(conversation.length === 0){
            res.status(400).json({
                success: false,
                message: "Conversation tidak boleh kosong",
                data: null
            });
            return
        }

        conversation.forEach(message => {
            if(!message || typeof message !== "object") {
                messageIsValid = "false";
            return
            }

            const keys = Object.keys(message);
            const objectHasValidKeys = keys.every((key) => 
                ["text","role"].includes(key),
            );

            if(keys.length !== 2 || !objectHasValidKeys){
              messageIsValid = false;
              return
            }

        const {text,role} = message;

        if(!["model","user"].includes(role)){
            messageIsValid = false;
            return
        }

        if(!text || typeof text !== "string"){
            messageIsValid = false;
            return
        }
        });

        if(!messageIsValid){
            throw new Error("Message Harus Valid")
        }

        //proses daging nya
        const contents = conversation.map(({role,text})=>({
            role,
            parts: [{text}],
        }));

        const dataBukuObject = require('./knowledge/dataBuku.json');
        const dataBukuString = JSON.stringify(dataBukuObject.daftar_buku, null, 2);

        const aiResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents,
            config:{
                systemInstruction: `Anda adalah seorang pustakawan. Jawablah pertanyaan berikut dengan baik, sopan, intuitif, ramah untuk orang senior sampai anak-anak dan HANYA berdasarkan konteks yang diberikan. Jika informasinya tidak ada, katakan 'Data buku tersebut tidak tersedia dalam katalog. konteks sebagai berikut:
                ${dataBukuString}
                dan jika ada berikan sedikit sinopsis (50 kata saja) diambil data dari internet
                `.trim(),
           },
        });

        res.status(200).json({
            success: true,
            message: "Berhasil dijawab Gemini AI",
            data: aiResponse.text,
        });
    }catch(e){
        res.status(500).json({
            success: false,
            message: "Sepertinya server sedang masalah."+e.message,
            data: null
        });
    }
});

app.listen(3000, () => {
    console.log('Server running di port 3000')
});