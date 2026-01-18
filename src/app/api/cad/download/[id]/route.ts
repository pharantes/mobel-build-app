import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { generateDXF, generateSVG } from '@/lib/cadGenerator';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const project = await Project.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    if (!project.technicalSpecs || !project.technicalSpecs.cadCoordinates) {
      return NextResponse.json(
        { success: false, error: 'CAD data not available. Please generate design first.' },
        { status: 400 }
      );
    }

    // Get format from query params (default to dxf)
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'dxf';

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'svg') {
      content = generateSVG(project.technicalSpecs.cadCoordinates, project.name);
      mimeType = 'image/svg+xml';
      filename = `${project.name.replace(/\s+/g, '_')}.svg`;
    } else {
      content = generateDXF(project.technicalSpecs.cadCoordinates);
      mimeType = 'application/dxf';
      filename = `${project.name.replace(/\s+/g, '_')}.dxf`;
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error('CAD download error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate CAD file' },
      { status: 500 }
    );
  }
}
