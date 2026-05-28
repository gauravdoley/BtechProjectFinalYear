import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: users, error } = await supabase.from('users').select('*');
  return NextResponse.json({ users, error });
}
