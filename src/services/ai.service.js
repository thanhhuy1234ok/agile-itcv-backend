const fs = require('fs');
const pdfParse = require('pdf-parse');
const Job = require('../schema/jobs.schema.js');
const path = require('path');

const knownSkills = [
    'node.js', 'react', 'express', 'mongodb', 'docker', 'rest api',
    'typescript', 'javascript', 'python', 'html', 'css'
];

const knownLanguages = {
    english: ['english', 'tiếng anh'],
    japanese: ['japanese', 'tiếng nhật'],
    korean: ['korean', 'tiếng hàn'],
    french: ['french', 'tiếng pháp'],
    german: ['german', 'tiếng đức'],
    chinese: ['chinese', 'tiếng trung']
};

const extractSkills = (text) => {
    const lower = text.toLowerCase();
    return knownSkills.filter(skill => lower.includes(skill));
};

const extractLanguages = (text) => {
    const lower = text.toLowerCase();
    const found = [];

    for (const [standardLang, aliases] of Object.entries(knownLanguages)) {
        if (aliases.some(alias => lower.includes(alias))) {
            found.push(standardLang);
        }
    }

    return found;
};

async function analyzeCV(cvPath, jobId) {
    const fullPath = path.resolve(process.cwd(), cvPath);

    if (!fs.existsSync(fullPath)) throw new Error(`Không tìm thấy file: ${fullPath}`);

    const buffer = fs.readFileSync(fullPath);
    const pdfData = await pdfParse(buffer);
    const cvText = pdfData.text;

    // Lấy kỹ năng yêu cầu từ Job
    const jobModel = await Job.findById(jobId);
    const jobSkills = (jobModel?.skill || []).map(s => s.toLowerCase());

    const cvSkills = extractSkills(cvText);
    const matchedSkills = jobSkills.filter(skill => cvSkills.includes(skill));

    // ✅ Điểm kỹ năng
    let score = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 10 : 0;

    // ✅ Thêm điểm nếu có ngôn ngữ
    const foundLanguages = extractLanguages(cvText);
    if (foundLanguages.length > 0) {
        score += 1; // cộng thêm 1 điểm nếu có ngôn ngữ
    }

    // ✅ Giới hạn tối đa 10
    score = Math.min(10, Math.round(score * 100) / 100);

    return {
        score,
        matchedSkills,
        analysis: {
            skillMatchPercent: jobSkills.length ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 0,
            foundLanguages,
            summary: `${matchedSkills.length}/${jobSkills.length} kỹ năng phù hợp, ngôn ngữ: ${foundLanguages.join(', ') || 'Không có'}`
        }
    };
}

module.exports = {
    analyzeCV
};
