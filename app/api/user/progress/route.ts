import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('points, active_theme, custom_colors, role')
      .eq('id', userId)
      .maybeSingle();

    if (userError) throw userError;

    // Fetch modules
    const { data: modulesData, error: modulesError } = await supabase
      .from('user_modules')
      .select('module_id, status')
      .eq('user_id', userId);

    if (modulesError) throw modulesError;

    // Fetch badges
    const { data: badgesData, error: badgesError } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);

    if (badgesError) throw badgesError;

    // Fetch themes
    const { data: themesData, error: themesError } = await supabase
      .from('user_themes')
      .select('theme_id')
      .eq('user_id', userId);

    if (themesError) throw themesError;

    // Format payload
    const unlockedModules = modulesData.filter(m => m.status === 'unlocked' || m.status === 'completed').map(m => m.module_id);
    const completedModules = modulesData.filter(m => m.status === 'completed').map(m => m.module_id);
    const earnedBadges = badgesData.map(b => b.badge_id);
    const unlockedThemes = themesData.map(t => t.theme_id);

    return NextResponse.json({
      points: userData?.points || 0,
      activeTheme: userData?.active_theme || 'teal',
      customColors: userData?.custom_colors || null,
      role: userData?.role || 'student',
      unlockedModules,
      completedModules,
      earnedBadges,
      unlockedThemes
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
