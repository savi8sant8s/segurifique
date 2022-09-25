import axios from "axios";

const baseURL = process.env.LIBRE_TRANSLATE_API_URL

export async function translate(text: string) {
    const response = await axios.post(`${baseURL}/translate`, {
        q: text,
        source: "en",
        target: "pt",
        format: "text"
    })
    return response.data.translatedText
}