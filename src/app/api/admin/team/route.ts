import { NextResponse } from 'next/server';
import {
  getLiveTeamMembers,
  saveLiveTeamMember,
  deleteLiveTeamMember,
} from '@/lib/team';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function GET() {
  try {
    const team = await getLiveTeamMembers();
    return NextResponse.json({ success: true, data: team });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch team members';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrator session required.' },
      { status: 401 }
    );
  }

  try {
    const json = await request.json();
    if (!json.name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }
    if (!json.role) {
      return NextResponse.json({ success: false, error: 'Role/Title is required' }, { status: 400 });
    }

    const saved = await saveLiveTeamMember(json);
    return NextResponse.json({ success: true, data: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saving team member';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrator session required.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing team member id' }, { status: 400 });
    }

    const deleted = await deleteLiveTeamMember(id);
    return NextResponse.json({ success: true, deleted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting team member';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
