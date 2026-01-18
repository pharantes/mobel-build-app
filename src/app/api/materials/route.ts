import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Material from '@/models/Material';

// GET all materials
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const available = searchParams.get('available');

    const query: any = {};
    if (type) query.type = type;
    if (available) query.availability = available === 'true';

    const materials = await Material.find(query).sort({ name: 1 }).lean();

    return NextResponse.json({
      success: true,
      data: materials,
    });
  } catch (error: any) {
    console.error('Get materials error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

// POST create new material (admin function - would need role check)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    await dbConnect();

    const material = await Material.create(body);

    return NextResponse.json(
      {
        success: true,
        data: material,
        message: 'Material created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create material error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create material' },
      { status: 500 }
    );
  }
}
