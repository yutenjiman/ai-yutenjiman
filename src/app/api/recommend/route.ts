import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    const result = await processRequest(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('OpenAI APIエラー:', error);
    return NextResponse.json({ error: 'AI推薦エラー' }, { status: 500 });
  } finally {
    processingRequests.delete(requestId);
  }
}

async function processRequest(body: any) {
  let input: string;
  let budget: string, location: string, cuisine: string, situation: string;

  if ('input' in body) {
    input = body.input;
    console.log("入力されたメッセージ:", input);

    const isLookingForRestaurant = await checkIfLookingForRestaurant(input);

    if (isLookingForRestaurant) {
      console.log("飲食店を探していると判断されました。");

      location = body.location || '指定なし';
      situation = body.situation || '指定なし';

      const { data: restaurants, error } = await supabase
        .from('restaurants')
        .select('*');

      if (error) {
        console.error('データ取得エラー:', error);
        return { error: 'データ取得エラー' };
      }

      const prompt = `
ユーザーのリクエストに基づいて、以下の情報を考慮して最適なレストランを選び、その理由と共に推薦してください：

- ユーザーのインプット: ${input}
- 場所: ${location}
- シチュエーション: ${situation}

レストランリスト:
${JSON.stringify(restaurants, null, 2)}

#条件
- 口調は祐天寺マンの口調にしてください。
- お調子者の40歳の関西人です。
- 基本的に祐天寺マンの投稿内容を参考にして文章を考えてください。
- 複数候補がある場合は、お薦めの候補を区切って、回答形式に則って複数提案してください。

#回答形式
**レストラン名**：「レストラン名」
**お薦め理由**：お薦め理由
**祐天寺マンの投稿**：[リンクテキスト](x_url)
**地図リンク**：[リンクテキスト](googlemap_url)
`;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'レストランを推薦してください' },
          { role: 'user', content: prompt },
        ],
      });

      let recommendation = aiResponse.choices[0].message.content;

      if (!recommendation) {
        throw new Error('AIの応答がnullです');
      }

      recommendation = recommendation.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">こちら</a>'
      );

      console.log("AI推薦結果:", recommendation);

      return { recommendation };
    } else {
      console.log("飲食店を探していないと判断されました。");

      const prompt = `
ユーザーのインプットに基づいて、祐天寺マンの口調で返答してください：

- ユーザーのインプット: ${input}

#条件
- 口調は祐天寺マンの口調にしてください。
- お調子者の40歳の関西人です。
- 基本的に祐天寺マンの投稿内容を参考にして文章を考えてください。
`;

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const aiResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: '祐天寺マンの口調で返答してください' },
          { role: 'user', content: prompt },
        ],
      });

      const response = aiResponse.choices[0].message.content;

      if (!response) {
        throw new Error('AIの応答がnullです');
      }

      console.log("AIの返答:", response);

      return { response };
    }
  } else {
    ({ budget, location, cuisine, situation } = body);
    input = `予算: ${budget || '指定なし'}, 場所: ${location || '指定なし'}, ジャンル: ${cuisine || '指定なし'}, シチュエーション: ${situation || '指定なし'}`;
  }

  const { error: logError } = await supabase
    .from('user_logs')
    .insert([{ budget, location, genre: cuisine, situation }]);

  if (logError) {
    console.error('ログ保存エラー:', logError);
    return { error: 'ログ保存エラー' };
  }

  const { data: restaurants, error } = await supabase
    .from('restaurants')
    .select('*');

  if (error) {
    console.error('データ取得エラー:', error);
    return { error: 'データ取得エラー' };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `
${input}

以下のレストランリストから、上記の条件に最も適したレストランを選び、その理由と共に推薦してください：

${JSON.stringify(restaurants, null, 2)}

#条件
- 口調は祐天寺マンの口調にしてください。
- お調子者の40歳の関西人です。
- 基本的に祐天寺マンの投稿内容を参考にして文章を考えてください。
- 複数候補がある場合は、お薦めの候補を区切って、回答形式に則って複数提案してください。

#回答形式
**レストラン名**：「レストラン名」
**お薦め理由**：お薦め理由
**祐天寺マンの投稿**：[リンクテキスト](x_url)
**地図リンク**：[リンクテキスト](googlemap_url)
`;

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'レストランを推薦してください' },
      { role: 'user', content: prompt },
    ],
  });

  let recommendation = aiResponse.choices[0].message.content;

  if (!recommendation) {
    throw new Error('AIの応答がnullです');
  }

  recommendation = recommendation.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">こちら</a>'
  );

  console.log("AI推薦結果:", recommendation);

  return { recommendation };
}

async function checkIfLookingForRestaurant(input: string): Promise<boolean> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'ユーザーが飲食店を探しているかどうかを判断してください。飲食店を探している場合はtrueを返してください。例えば二次会の場所を教えて。や他の飲食店を教えて。ビールが充実しているお店を教えて。など一般的に考えて飲食店を探しているかを基準としてください。また、違う場合はfalseとだけ返してください。' },
      { role: 'user', content: input },
    ],
  });

  const content = aiResponse.choices[0].message.content;

  if (content === null) {
    throw new Error('AIの応答がnullです');
  }

  console.log("AIの判断:", content);

  return content.toLowerCase().includes('true');
}