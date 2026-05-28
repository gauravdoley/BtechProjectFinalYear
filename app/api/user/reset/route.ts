import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Reset points and themes in the users table
    const { error: userError } = await supabase
      .from('users')
      .update({
        points: 0,
        active_theme: 'teal',
        custom_colors: null
      })
      .eq('id', userId);

    if (userError) throw userError;

    // Delete all user_badges
    await supabase.from('user_badges').delete().eq('user_id', userId);

    // Delete all user_themes
    await supabase.from('user_themes').delete().eq('user_id', userId);

    // Reset user_modules (delete all, then unlock module-1)
    await supabase.from('user_modules').delete().eq('user_id', userId);
    
    await supabase.from('user_modules').insert({
      user_id: userId,
      module_id: 'module-1',
      status: 'unlocked'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
