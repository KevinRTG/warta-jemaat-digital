import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDevotionalSummary = async (title: string, date: string): Promise<string> => {
  try {
    const prompt = `
      Saya adalah admin gereja GKO Cibitung. Saya sedang mengupload Warta Jemaat dengan judul "${title}" untuk tanggal ${date}.
      
      Tolong buatkan satu kalimat singkat (maksimal 20 kata) yang berisi ayat referensi Alkitab yang relevan dan kata-kata penyemangat berdasarkan judul tersebut untuk ditampilkan di deskripsi singkat warta.
      
      Bahasa: Indonesia.
      Output: Hanya teks kalimat tersebut, tanpa tanda kutip.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Tuhan memberkati pelayanan kita bersama.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Silakan unduh warta untuk detail lengkap.";
  }
};
