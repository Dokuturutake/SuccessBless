import { get } from 'svelte/store';
import { apiKeyStore } from './stores/apiKeyStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiTweet {
  username: string;
  text: string;
}

export async function getGeminiResponseTweet(prompt: string): Promise<GeminiTweet[]> {
  const apiKey = get(apiKeyStore);
  if (!apiKey) {
    throw new Error('API key is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonText = removeSpecificStrings(text);

    console.log(jsonText);
    
    // Gemini APIのレスポンス構造に応じて適切にパースする必要があります
    // この例では、レスポンスのtextフィールドが直接JSON文字列であると仮定しています
    const jsonResponse = JSON.parse(jsonText);
    console.log(jsonResponse);
    return jsonResponse as GeminiTweet[];
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to fetch from Gemini API');
  }
}

function removeSpecificStrings(text:string) {
  // 削除したい文字列の配列
  const stringsToRemove = ["'''", "Json", "```", "json"];

  // 正規表現を作成
  const regex = new RegExp(stringsToRemove.join('|'), 'gi');

  // 指定した文字列を空文字に置き換える
  return text.replace(regex, '');
}


interface GeminiTweetAnalysis {
  evaluation: string;
  likes: number;
  improvement_points: string;
}

interface DisplayTweet {
  likes: number;
  reply: string;
}

export async function analyzeTweetWithGemini(tweet: string): Promise<DisplayTweet> {
  const apiKey = get(apiKeyStore);
  if (!apiKey) {
    throw new Error('API key is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
ツイートのいいね数を予測し、評価理由、いいね数、および改善ポイントを含むJson形式で結果を出力してください。評価にはランダム性を持たせてください。素数

#Tweets
「${tweet}」

# Steps

1. ツイートの内容を分析し、いいねが得られそうな要素を特定します。
2. これらの要素をもとに、いいね数をランダムに予測します。
3. 各要素の評価理由をまとめます。
4. ツイートが改善できるポイントを考慮します。

# Output Format

以下の情報を含むJson形式で出力してください。
- 評価理由: ツイートの要素に基づく評価
- いいね数: ランダムに予測されたいいね数
- 改善ポイント: ツイートの改善に関するアドバイス

'''json
{
  "evaluation": "このツイートは面白い画像を含んでおり、エンゲージメントを増やす可能性があります。",
  "likes": 250,
  "improvement_points": "ツイートのハッシュタグを増やすとより多くの人にリーチできます。"
}
'''

# Examples

**Example 1:**

- **Input:** 「夏の思い出には最高の一枚 」
- **Output:**
  '''json
  {
    "evaluation": "季節に合った内容で共感を得やすいです。",
    "likes": 300,
    "improvement_points": "ビジュアルの質を高めるとより効果的です。"
  }
  '''
(この例は実際の予測値として300のいいねが表示されていますが、リソースによって多様な数値に変わることがあります。)
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonText = removeSpecificStrings(text);
    const analysis: GeminiTweetAnalysis = JSON.parse(jsonText);

    return convertToDisplayTweet(analysis);
  } catch (error) {
    console.error('Error analyzing tweet with Gemini:', error);
    throw new Error('Failed to analyze tweet with Gemini API');
  }
}

function convertToDisplayTweet(analysis: GeminiTweetAnalysis): DisplayTweet {
  return {
    likes: analysis.likes,
    reply: `評価: ${analysis.evaluation}\n改善ポイント: ${analysis.improvement_points}`
  };
}