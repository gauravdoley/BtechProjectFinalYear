import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // In a real app, verify that the userId belongs to an admin.
    // For now, just fetch all users.
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedUsers = users.map(u => ({
      id: u.id,
      name: u.name || 'Ocean Explorer',
      email: u.email,
      points: u.points || 0,
      modulesCompleted: u.points > 100050 ? 3 : 1, // Mock based on points
      badges: u.points > 100050 ? 2 : 0, // Mock badges for UI
      role: u.role || 'user',
      status: 'Active'
    }));

    return NextResponse.json(formattedUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
