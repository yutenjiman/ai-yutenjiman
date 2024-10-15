import { createClient } from '@supabase/supabase-js'
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const processingRequests = new Set();

export async function POST(req: NextRequest) {
  const requestId = uuidv4();

  if (processingRequests.size > 0) {
    return NextResponse.json({ error: 'リクエスト処理中' }, { status: 429 });
  }

  processingRequests.add(requestId);

  try {
    const body = await req.json();
    console.log("API ルートで受け取ったデータ:", body);

    let input: string;
    let budget: string, location: string, cuisine: string, situation: string;

    if ('input' in body) {
      input = body.input;
      console.log("入力されたメッセージ:", input);
      
      const aiResponse = await handleFollowUpQuestion(input);
      return NextResponse.json({ recommendation: aiResponse });
    } else {
      ({ budget, location, cuisine, situation } = body);
      input = `予算: ${budget || '指定なし'}, 場所: ${location || '指定なし'}, ジャンル: ${cuisine || '指定なし'}, シチュエーション: ${situation || '指定なし'}`;
    }

    const { error: logError } = await supabase
      .from('user_logs')
      .insert([{ budget, location, genre: cuisine, situation }]);

    if (logError) {
      console.error('ログ保存エラー:', logError);
      return NextResponse.json({ error: 'ログ保存エラー' }, { status: 500 });
    }

    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*');

    if (error) {
      console.error('データ取得エラー:', error);
      return NextResponse.json({ error: 'データ取得エラー' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
${input}

以下のレストランリストから、上記の条件に最も適したレストランを1つ選び、その理由と共に推薦してください：

${JSON.stringify(restaurants, null, 2)}

回答形式：
レストラン名：
推薦理由：
`;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'レストランを推薦してください' },
        { role: 'user', content: prompt },
      ],
    });

    const recommendation = aiResponse.choices[0].message.content;

    console.log("AI推薦結果:", recommendation);

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('OpenAI APIエラー:', error);
    return NextResponse.json({ error: 'AI推薦エラー' }, { status: 500 });
  } finally {
    processingRequests.delete(requestId);
  }
}

async function handleFollowUpQuestion(input: string): Promise<string> {
  // OpenAI APIを使用して通常のチャットメッセージを処理
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: '追加の質問に答えてください。' },
      { role: 'user', content: input },
    ],
  });

  const content = aiResponse.choices[0].message.content;
  
  if (content === null) {
    throw new Error('AIの応答がnullです');
  }

  return content;
}