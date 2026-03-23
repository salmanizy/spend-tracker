// app/api/expenses/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const id = params.id;

    const { data, error } = await supabase
      .from('expenses')
      .update({
        amount: Number(body.amount),
        description: body.description,
        date: body.date,
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API PUT Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API DELETE Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}