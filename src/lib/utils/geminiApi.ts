import { get } from 'svelte/store';
import { apiKeyStore } from '$lib/stores/apiKeyStore';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import analyzeTweetPrompt from '$lib/data/prompt_eval.md?raw';
import getResponseTweetsPrompt from '$lib/data/prompt_reply.md?raw';
import tweetUnderstandPrompt from '$lib/data/prompt_tweet_understanding.md?raw'
import CharacterTxt from '$lib/data/character_style_list.txt?raw'
import { Description } from '$lib/components/ui/alert';

interface GeminiTweet {
  username: string;
  text: string;
}

interface GeminiTweetAnalysis {
  evaluation: string;
  likes: number;
  improvement_points: string;
}

interface GeminiResponse {
  predicted_likes: number;
  replies: GeminiTweet[];
}

interface DisplayTweet {
  likes: number;
  reply: string;
}

class GeminiApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiApiError';
  }
}

const schema = {
  type: SchemaType.OBJECT,
  properties: {
    predicted_likes: {
      type: SchemaType.NUMBER,
      description: "予測されるいいね数",
    },
    replies: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          username: {
            type: SchemaType.STRING,
            description: "ユーザー名",
          },
          text: {
            type: SchemaType.STRING,
            description: "返信テキスト",
          },
        },
        required: ["username", "text"],
      },
    },
  },
  required: ["predicted_likes", "replies"],
};

class GeminiApi {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private getModel(modelName: string = "gemini-1.5-flash") {
    return this.genAI.getGenerativeModel({ model: modelName , generationConfig: {
      temperature : 2.0,
      responseMimeType: "application/json",
      maxOutputTokens:2048,
      topP:0.99,
    }});
  }

  private static removeSpecificStrings(text: string): string {
    const stringsToRemove = ["'", "Json", "`", "json"];
    const regex = new RegExp(stringsToRemove.join('|'), 'gi');
    return text.replace(regex, '');
  }

  private static parseJsonResponse<T>(text: string): T {
    
    const jsonText = GeminiApi.removeSpecificStrings(text);
    try {
      console.log(jsonText);
      return JSON.parse(jsonText) as T;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw new GeminiApiError('Failed to parse Gemini API response');
    }
  }

  private static formatPrompt(template: string, replacements: Record<string, string>): string {
    return Object.entries(replacements).reduce(
      (prompt, [key, value]) => prompt.replace(`{{${key}}}`, value),
      template
    );
  }

  async getResponseTweets(tweetContent: string, image?: File): Promise<GeminiResponse> {
    const model = this.getModel();
    console.log(tweetContent);
    const prompt = GeminiApi.formatPrompt(generateReplyPrompt().prompt, { tweetContent });
    

    try {
      let result;
      if (image) {
        const imageData = await this.fileToGenerativePart(image);
        result = await model.generateContent([prompt, imageData]);
      } else {
        result = await model.generateContent(prompt);
      }
      const response = await result.response;
      const text = response.text();
      
      return GeminiApi.parseJsonResponse<GeminiResponse>(text);
    } catch (error) {
      console.error('Error generating content:', error);
      throw new GeminiApiError('Failed to fetch from Gemini API');
    }
  }

  private async fileToGenerativePart(file: File): Promise<GoogleGenerativeAI.Part> {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const base64EncodedData = await base64EncodedDataPromise;
    const mimeType = file.type;

    return {
      inlineData: {
        data: base64EncodedData.split(',')[1],
        mimeType
      }
    };
  }

  async analyzeTweet(tweet: string): Promise<DisplayTweet> {
    const model = this.getModel();
    const prompt = GeminiApi.formatPrompt(analyzeTweetPrompt, { tweet });

    try {
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const analysis = GeminiApi.parseJsonResponse<GeminiTweetAnalysis>(text);
      return this.convertToDisplayTweet(analysis);
    } catch (error) {
      console.error('Error analyzing tweet with Gemini:', error);
      throw new GeminiApiError('Failed to analyze tweet with Gemini API');
    }
  }

  async understandingTweet(tweet: string): Promise<string> {
    const model = this.getModel();
    const prompt = GeminiApi.formatPrompt(tweetUnderstandPrompt,{ tweet });

    try {
      
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const rmSpText = GeminiApi.removeSpecificStrings(text)
      const TweetAddText = this.insertJsonTweet(rmSpText, tweet);
      return TweetAddText;
    } catch (error) {
      console.error('Error analyzing tweet with Gemini:', error);
      throw new GeminiApiError('Failed to analyze tweet with Gemini API');
    }
  }


  private convertToDisplayTweet(analysis: GeminiTweetAnalysis): DisplayTweet {
    return {
      likes: analysis.likes,
      reply: `評価: ${analysis.evaluation}\n改善ポイント: ${analysis.improvement_points}`
    };
  }

  private insertJsonTweet(jsonData:string, tweet:string) {
    // JSON文字列をオブジェクトに変換
    const data = JSON.parse(jsonData);

    // ルートに"Name":"Taro"を追加
    data.tweet = tweet;

    // オブジェクトをJSON文字列に戻す
    return JSON.stringify(data);
  }
}

export function createGeminiApi(): GeminiApi {
  const apiKey = get(apiKeyStore);
  if (!apiKey) {
    throw new GeminiApiError('API key is not set');
  }
  return new GeminiApi(apiKey);
}

export function generateReplyPrompt() {
  try {
    // キャラクターファイルを読み込む
    const charactersText = CharacterTxt;
    const characters = charactersText.split('\n').filter(line => line.trim() !== '');

    // プロンプトファイルを読み込む
    const promptTemplate = getResponseTweetsPrompt;

    // ランダムにキャラクターを選択
    const selectedCharacters = [];
    const tempCharacters = [...characters];
    const max = 15;
    const min = 5;
    const length = getRandomNumber(min, max);
    while (selectedCharacters.length < length && tempCharacters.length > 0) {
      const randomIndex = Math.floor(Math.random() * tempCharacters.length);
      selectedCharacters.push(tempCharacters.splice(randomIndex, 1)[0]);
    }

    // 選択されたキャラクターをプロンプトに挿入
    const characterList = selectedCharacters.map(char => `   - ${char.split(',')[0]}`).join('\n');
    const generatedPrompt = promptTemplate.replace('{{selectedCharacters}}', characterList);

    return {
      prompt: generatedPrompt,
      characters: selectedCharacters
    };
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw new Error('Failed to generate prompt');
  }
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}