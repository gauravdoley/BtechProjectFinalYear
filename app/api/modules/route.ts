import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('modules').select('*').order('created_at', { ascending: true });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Transform DB snake_case fields back to camelCase for the frontend
  const formattedData = data.map(mod => ({
    id: mod.id,
    title: mod.title,
    subtitle: mod.subtitle,
    difficulty: mod.difficulty,
    readingTime: mod.reading_time,
    description: mod.description,
    unlockCodeRequired: mod.unlock_code_required,
    unlockedCodeReward: mod.unlocked_code_reward,
    color: mod.theme_colors.color,
    borderColor: mod.theme_colors.borderColor,
    bgColor: mod.theme_colors.bgColor,
    accentColor: mod.theme_colors.accentColor,
    content: mod.content
  }));

  return NextResponse.json(formattedData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Convert frontend camelCase format to DB snake_case
    const dbPayload = {
      id: body.id,
      title: body.title,
      subtitle: body.subtitle,
      difficulty: body.difficulty,
      reading_time: body.readingTime,
      description: body.description,
      unlock_code_required: body.unlockCodeRequired || null,
      unlocked_code_reward: body.unlockedCodeReward || null,
      theme_colors: {
        color: body.color,
        borderColor: body.borderColor,
        bgColor: body.bgColor,
        accentColor: body.accentColor
      },
      content: body.content
    };

    const { data, error } = await supabase.from('modules').upsert(dbPayload).select();

    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
