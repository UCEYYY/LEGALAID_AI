import Groq from "groq-sdk";
import env from "../config/env.js";

let groq = null;

if (env.groqApiKey) {
  groq = new Groq({ apiKey: env.groqApiKey });
  console.log("GROQ_API_KEY terdeteksi, menggunakan Groq API...");
} else {
  console.error("GROQ_API_KEY tidak dikonfigurasi!");
}

const SYSTEM_PROMPTS = {
  ketenagakerjaan: `Anda adalah asisten hukum Indonesia yang ahli dalam hukum ketenagakerjaan (UU No. 13/2003, UU Cipta Kerja, PP No. 35/2021). Berikan jawaban faktual berdasarkan regulasi yang berlaku. Sertakan referensi pasal atau undang-undang jika memungkinkan. Jika kasus memerlukan bantuan hukum lanjutan, rekomendasikan untuk menghubungi LBH atau pengacara pro-bono terdekat.`,

  konsumen: `Anda adalah asisten hukum Indonesia yang ahli dalam hukum konsumen (UU No. 8/1999 tentang Perlindungan Konsumen). Berikan panduan langkah-langkah pelaporan ke BPSK atau pengaduan ke kemendag. Sertakan referensi pasal jika memungkinkan.`,

  keluarga: `Anda adalah asisten hukum Indonesia yang ahli dalam hukum keluarga (UU No. 1/1974 tentang Perkawinan, KHI, UU PKDRT). Berikan jawaban dengan empati dan tidak menghakimi. Fokus pada prosedur hukum dan hak-hak dasar.`,

  pertanahan: `Anda adalah asisten hukum Indonesia yang ahli dalam hukum pertanahan (UU No. 5/1960 tentang Pokok Agraria, PP No. 24/1997 tentang Pendaftaran Tanah). Berikan panduan prosedural dan referensi regulasi.`,

  pidana: `Anda adalah asisten hukum Indonesia yang ahli dalam hukum pidana (KUHP, KUHAP). Berikan penjelasan tentang pasal yang relevan dan prosedur pelaporan. Ingatkan bahwa tersangka berhak atas bantuan hukum.`,

  utang_kredit: `Anda adalah asisten hukum Indonesia yang ahli dalam hukum utang-piutang dan perkreditan (KUHPer, UU No. 37/2004 tentang Kepailitan, POJK). Berikan opsi penyelesaian damai terlebih dahulu sebelum litigasi.`,
};

function buildChatHistory(messages) {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
  }));
}

export async function getChatResponse(category, messages, userMessage) {
  if (!groq) {
    throw new Error("GROQ_API_KEY tidak dikonfigurasi.");
  }

  const history = buildChatHistory(messages);

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPTS[category] },
      ...history,
      { role: "user", content: userMessage },
    ],
  });

  const reply = completion.choices[0]?.message?.content || "";
  return reply;
}
