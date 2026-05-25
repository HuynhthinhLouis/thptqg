import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.post('/api/generate-syllabus', async (req, res) => {
    const { userCurriculum } = req.body;
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.3-70b-instruct:free",
                messages: [
                    { role: "system", content: "Bạn là một chuyên gia giáo dục luyện thi THPT Quốc Gia tại Việt Nam. Hãy phân tích giáo trình và thiết kế lộ trình học tối ưu." },
                    { role: "user", content: `Đây là giáo trình/mục tiêu của tôi: ${userCurriculum}. Hãy tạo lộ trình học tốt nhất.` }
                ]
            })
        });
        const data = await response.json();
        res.json({ result: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Lỗi kết nối AI" });
    }
});

app.get('/api/thpt-news', async (req, res) => {
    try {
        const response = await fetch('https://vnexpress.net/rss/giao-duc.rss');
        const rssText = await response.text();
        res.set('Content-Type', 'text/xml');
        res.send(rssText);
    } catch (error) {
        res.status(500).json({ error: "Không thể tải tin tức" });
    }
});

app.listen(PORT, () => console.log(`Hệ thống đang chạy tại: http://localhost:${PORT}`));
