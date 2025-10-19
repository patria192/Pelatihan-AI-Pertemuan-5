how to use:
1. node js version v22.20.0 & install all dependecy:
   
   "@google/genai": "^1.25.0",
   
    "@langchain/community": "^1.0.0" (except),
   
    "@langchain/core": "^1.0.1" (except),
   
    "cors": "^2.8.5",
   
    "dotenv": "^16.4.5",
   
    "express": "^5.1.0",
   
    "hnswlib-node": "^3.0.0" (except),
    
    "langchain": "^1.0.1",
   
    "multer": "^2.0.2"
   
3. rename .env.example to .env & use your gemini api key
4. to run server type:  node index.js, use your browser to url http://localhost:3000/
5. untuk konteks Gemini sebagai seorang pustakawan hanya mencakup data buku di folder knowledge.dataBuku.json, jika tidak ada maka 'Data buku tersebut tidak tersedia dalam katalog.'

sample prompt:
halo selamat sore
'gemini res'
apakah ada buku tentang filsafat ?
'gemini res'
apakah ada buku fantasy

example knowledge data json:
{
  "toko_buku": "MediaGra",
  "total_buku": 3,
  "daftar_buku": [
    {
      "id": 1,
      "judul": "Filosofi Teras",
      "penulis": "Henry Manampiring",
      "tahun_terbit": 2018,
      "genre": ["Non-Fiksi","Pengembangan Diri"],
      "isbn": "978-602-482071-3"
    },
    {
      "id": 2,
      "judul": "Bumi Manusia",
      "penulis": "Pramoedya Ananta Toer",
      "tahun_terbit": 1980,
      "genre": ["Fiksi","Sejarah"],
      "isbn": "978-979-910543-1"
    },
    {
      "id": 3,
      "judul": "Atomic Habits",
      "penulis": "James Clear",
      "tahun_terbit": 2018,
      "genre": ["Non-Fiksi","Pengembangan Diri"],
      "isbn": "978-073-521129-2"
    },
    {
      "id": 4,
      "judul": "Naruto",
      "penulis": "Masashi Kishimoto",
      "tahun_terbit": 1997,
      "genre": ["komik","petualangan"],
      "isbn": "988-153-523329-2"
    },
    {
      "id": 5,
      "judul": "Harry Potter dan Batu Bertuah",
      "penulis": "J.K. Rowling",
      "tahun_terbit": 1997,
      "genre": ["novel","fiksi fantasi"],
      "isbn": "910-153-522129-6"
    }
  ]
}
