//import dependency
import express from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

import 'dotenv/config';
import { config } from "dotenv";

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
})

app.listen(3000, () => {
    console.log('Server running di port 3000')
});