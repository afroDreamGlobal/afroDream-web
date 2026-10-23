import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const services = store.getServices();
  return NextResponse.json({ success: true, data: services });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    if (!json.title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const saved = store.saveService(json);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saving service';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing service id' }, { status: 400 });
    }

    const deleted = store.deleteService(id);
    return NextResponse.json({ success: true, deleted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting service';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
