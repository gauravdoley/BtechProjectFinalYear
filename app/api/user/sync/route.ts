import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress || '';
    const name = user?.fullName || 'Ocean Explorer';

    // Check if user already exists
    const { data: existingUser } = await supabase.from('users').select('id').eq('id', userId).maybeSingle();

    if (!existingUser) {
      // Insert new user
      const { error } = await supabase.from('users').insert({
        id: userId,
        email: email,
        name: name,
        points: 0, // Starting points reset to 0
        active_theme: 'teal',
        role: 'student'
      });

      if (error) throw error;
      
      // Give them module-1 unlocked by default
      await supabase.from('user_modules').insert({
        user_id: userId,
        module_id: 'module-1',
        status: 'unlocked'
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
