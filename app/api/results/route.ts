import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env vars are not configured.');
  }
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const supabase = getSupabaseClient();
    const { data: result, error } = await supabase
      .from('test_results')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ id: result.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
