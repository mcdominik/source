import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

const MODEL = 'gpt-3.5-turbo';
const TEMPERATURE = 0.7;
const INSTRUCTIONS = `
  You are an accountant, the client gives you a text, which consists of expenses in different currencies,
  eg. "I spend 10$ for coffee" There may be some useless data like names, dates etc.
  Your task is to add all prices and returns only the sum (with currency code), without any additional text,
  you can assume all prices are in USD.
  good aswer example: "10 USD"
  `;

@Injectable()
export class SmartThingService {
  constructor(private readonly openai: OpenAI) {}

  async getAllPricesFromText(text: string) {
    const chatCompletion = await this.openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: INSTRUCTIONS },
        { role: 'user', content: text },
      ],
      temperature: TEMPERATURE,
    });
    return chatCompletion.choices[0].message.content;
  }
}
