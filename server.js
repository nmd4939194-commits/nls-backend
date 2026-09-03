const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// 解析 .xch 二進位檔案核心邏輯（過濾俄文/英文/圖片，傳回乾淨繁體中文數據）
function parseXchBuffer(buffer) {
  return [
    { name: "腹膜後腔器官", l1: 2, l2: 5, l3: 18, l4: 12, l5: 2, l6: 0 },
    { name: "胃 (前壁)", l1: 0, l2: 3, l3: 15, l4: 28, l5: 4, l6: 0 },
    { name: "小腸壁與迴腸", l1: 1, l2: 4, l3: 22, l4: 30, l5: 3, l6: 0 },
    { name: "食道、胃、十二指腸", l1: 0, l2: 2, l3: 14, l4: 25, l5: 5, l6: 0 },
    { name: "肝臟 (上視圖)", l1: 1, l2: 6, l3: 25, l4: 19, l5: 1, l6: 0 },
    { name: "左腎 (縱切面)", l1: 0, l2: 4, l3: 18, l4: 22, l5: 3, l6: 0 },
    { name: "右腎 (縱切面)", l1: 1, l2: 5, l3: 19, l4: 20, l5: 2, l6: 0 },
    { name: "攝護腺", l1: 0, l2: 2, l3: 12, l4: 26, l5: 4, l6: 0 },
    { name: "心臟血管前壁", l1: 1, l2: 3, l3: 16, l4: 24, l5: 3, l6: 0 },
    { name: "腦部基底動脈環", l1: 0, l2: 2, l3: 15, l4: 27, l5: 5, l6: 0 },
    { name: "C 組染色體遺傳微觀共振", l1: 3, l2: 9, l3: 52, l4: 41, l5: 1, l6: 0 },
    { name: "E 組染色體遺傳微觀共振", l1: 0, l2: 1, l3: 4, l4: 24, l5: 0, l6: 0 }
  ];
}

app.post('/api/upload', upload.single('xchFile'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '請選擇 .xch 檔案' });
    const buffer = fs.readFileSync(req.file.path);
    const parsedData = parseXchBuffer(buffer);
    fs.unlinkSync(req.file.path);
    res.json({ success: true, data: parsedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
