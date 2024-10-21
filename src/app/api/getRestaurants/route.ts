import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { data, error } = await supabase.from('restaurants').select('*');

  if (error) {
    console.error('データ取得エラー:', error);
    return NextResponse.json({ error: 'データ取得エラー' }, { status: 500 });
  }

  console.log("取得したデータ:", data); // データをログに出力
  return NextResponse.json(data, { status: 200 });
}