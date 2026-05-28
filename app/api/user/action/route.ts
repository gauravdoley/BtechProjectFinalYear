import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case 'unlock_module': {
        const { error } = await supabase.from('user_modules').upsert(
          { user_id: userId, module_id: payload.moduleId, status: 'unlocked' },
          { onConflict: 'user_id,module_id' }
        );
        if (error) throw error;
        break;
      }
      case 'complete_module': {
        const { error } = await supabase.from('user_modules').upsert(
          { user_id: userId, module_id: payload.moduleId, status: 'completed' },
          { onConflict: 'user_id,module_id' }
        );
        if (error) throw error;
        break;
      }
      case 'update_points': {
        const { data: user, error: fetchErr } = await supabase.from('users').select('points').eq('id', userId).maybeSingle();
        if (fetchErr) throw fetchErr;
        const newPoints = (user?.points || 0) + payload.amount;
        const { error } = await supabase.from('users').update({ points: newPoints }).eq('id', userId);
        if (error) throw error;
        break;
      }
      case 'award_badge': {
        const { error } = await supabase.from('user_badges').upsert(
          { user_id: userId, badge_id: payload.badgeId },
          { onConflict: 'user_id,badge_id' }
        );
        if (error) throw error;
        break;
      }
      case 'buy_theme': {
        const { data: buyer, error: buyerErr } = await supabase.from('users').select('points').eq('id', userId).maybeSingle();
        if (buyerErr) throw buyerErr;
        if ((buyer?.points || 0) >= payload.cost) {
          const { error: updateErr } = await supabase.from('users').update({ points: (buyer?.points || 0) - payload.cost }).eq('id', userId);
          if (updateErr) throw updateErr;
          const { error: upsertErr } = await supabase.from('user_themes').upsert(
            { user_id: userId, theme_id: payload.themeId },
            { onConflict: 'user_id,theme_id' }
          );
          if (upsertErr) throw upsertErr;
        } else {
          return NextResponse.json({ error: 'Not enough points' }, { status: 400 });
        }
        break;
      }
      case 'set_theme': {
        const { error } = await supabase.from('users').update({ active_theme: payload.themeId }).eq('id', userId);
        if (error) throw error;
        break;
      }
      case 'update_custom_colors': {
        const { error } = await supabase.from('users').update({ custom_colors: payload.colors }).eq('id', userId);
        if (error) throw error;
        break;
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Action API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
