import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  const routes = store.getTradeRoutes();
  return NextResponse.json({ success: true, data: routes });
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    if (!json.name) {
      return NextResponse.json({ success: false, error: 'Route name is required' }, { status: 400 });
    }

    const saved = store.saveTradeRoute(json);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saving route';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing route id' }, { status: 400 });
    }

    const deleted = store.deleteTradeRoute(id);
    return NextResponse.json({ success: true, deleted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting route';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
