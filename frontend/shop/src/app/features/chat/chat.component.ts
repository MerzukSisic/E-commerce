import { Component } from '@angular/core';
import { GeminiService } from '../../core/services/gemini.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  imports: [
    FormsModule,
    NgClass,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  isExpanded = false;
  userMessage = '';
  chatMessages: { text: string; isUser: boolean }[] = [];
  showFaq = false;

  faqData: { [key: string]: string } = {
    "What is this website about?":
      "This website is an online store for purchasing video games across multiple platforms, including PC, PlayStation, Xbox, and Nintendo Switch. We offer a wide range of digital and physical games from various publishers and developers. Our goal is to provide gamers with a seamless shopping experience, including competitive prices, regular discounts, and instant digital delivery for supported titles. \n\n" +
      "To purchase a game, you must first create an account and verify your email. Email verification is mandatory to ensure the security of transactions and prevent fraudulent purchases. Without a verified account, completing a purchase will not be possible. \n\n" +
      "We support secure payments through Stripe, accepting Visa, MasterCard, and American Express. Discount codes are available and will be updated regularly, with new promotional offers added over time. \n\n" +
      "Please note that we do not currently offer pre-orders for upcoming game releases. All available games can be purchased immediately if they are in stock. \n\n" +
      "Whether you're looking for the latest AAA titles, indie gems, or exclusive discounts, our platform is designed to cater to all gamers with a secure and user-friendly shopping experience.",

    "How do I purchase a game?":
      "To purchase a game, simply add it to your cart, proceed to checkout, and select a preferred payment method. Digital games are delivered instantly via email, while physical copies are shipped to your address. \n\n" +
      "Note that you must have a verified account to complete a purchase.",

    "How can I redeem a digital game key?":
      "After purchasing a digital game, you will receive a key via email. You can redeem it on the respective platform (Steam, PlayStation Store, Xbox Store, or Nintendo eShop) by entering the key in the 'Redeem Code' section.",

    "Do you offer refunds on digital games?":
      "Refunds on digital games are only available if the key has not been used. Please check our refund policy for more details.",

    "What payment methods do you accept?":
      "We support secure payments through Stripe, including Visa, MasterCard, and American Express. \n\n" +
      "Other payment methods such as PayPal, Google Pay, and Apple Pay are not currently available.",

    "Are there any discounts or special offers available?":
      "Yes! We frequently run discounts and seasonal sales. Discount codes will be updated regularly, and new promotional offers will be added over time. \n\n" +
      "Check our 'Deals' section for the latest promotions.",

    "How can I track my order?":
      "For physical game orders, you will receive a tracking number via email. Digital game purchases are available instantly in your account dashboard.",

    "Do you offer pre-orders for upcoming games?":
      "No, we do not offer pre-orders. Only games that are currently available in our catalog can be purchased.",

    "Can I gift a game to someone else?":
      "Yes! You can purchase a game as a gift by selecting the 'Gift' option at checkout and entering the recipient’s email address.",

    "Do I need an account to buy a game?":
      "Yes, an account is required to purchase a game. Additionally, your email must be verified before completing any transaction. \n\n" +
      "Having an account also allows you to track purchases, receive exclusive discounts, and access your digital game keys anytime."
  };


  defaultMessage = "I am here to assist only with questions about this page. Please ask something relevant.";

  constructor(private geminiService: GeminiService) {}

  toggleSupport(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleFaq(): void {
    this.showFaq = !this.showFaq;
  }

  getFaqQuestions(): string[] {
    return Object.keys(this.faqData);
  }

  sendFaqQuestion(question: string): void {
    this.userMessage = question;
    this.sendMessage();
  }

  async sendMessage(): Promise<void> {
    if (!this.userMessage.trim()) return;

    const userPrompt = this.userMessage.trim();
    this.chatMessages.push({ text: userPrompt, isUser: true });
    this.userMessage = '';

    this.chatMessages.push({ text: "Generating response...", isUser: false });

    try {
      const faqContext = this.formatFaqContext();
      const geminiPrompt = `${faqContext}\nUser Question: ${userPrompt}\nProvide a helpful and relevant answer.`;

      const botReply = await this.geminiService.generateResponse(geminiPrompt);
      console.log("Received response:", botReply);

      this.chatMessages.pop();
      this.chatMessages.push({ text: botReply, isUser: false });
    } catch (error) {
      console.error("Error fetching AI response:", error);

      this.chatMessages.pop();
      this.chatMessages.push({ text: "No response from AI.", isUser: false });
    }
  }

  private formatFaqContext(): string {
    return Object.entries(this.faqData)
      .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
      .join('\n\n');
  }
}
