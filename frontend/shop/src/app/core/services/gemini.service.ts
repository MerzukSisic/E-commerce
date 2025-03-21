import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiKey = 'AIzaSyCxZnvx4wZTvAIinjWk56YHyXxtykPhcCE'; // Zameni sa pravim API ključem
  private model: any;

  constructor() {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      console.log("Sending prompt:", prompt);
      const result = await this.model.generateContent(prompt);
      console.log("API response:", result);

      // Ispravno dohvaćanje odgovora
      const aiResponse = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiResponse) {
        return aiResponse;
      } else {
        console.warn("AI did not return a valid response.");
        return "No valid response from AI.";
      }
    } catch (error) {
      console.error("Error generating response:", error);
      return "An error occurred while processing the request.";
    }
  }

}
