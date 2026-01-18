import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import PricingInfo from '@/models/PricingInfo';
import Project from '@/models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Verify project belongs to user
    const project = await Project.findOne({
      _id: params.projectId,
      userId: session.user.id,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const pricing = await PricingInfo.findOne({
      projectId: params.projectId,
    }).populate('materials.materialId');

    if (!pricing) {
      return NextResponse.json(
        { success: false, error: 'Pricing information not available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error: any) {
    console.error('Get pricing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
