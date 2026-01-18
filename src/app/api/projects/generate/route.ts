import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import PricingInfo from '@/models/PricingInfo';
import { generateFurnitureDesign } from '@/lib/aiAdapter';
import { validateDimensions } from '@/lib/furnitureEngine';
import {
  estimateMaterialCost,
  estimateHardwareCost,
} from '@/lib/furnitureEngine/materialCalculator';

// POST generate furniture design
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
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get project
    const project = await Project.findOne({
      _id: projectId,
      userId: session.user.id,
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Validate dimensions
    const validation = validateDimensions(project.furnitureType, project.dimensions);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid dimensions',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Generate furniture design using AI adapter (currently rule-based)
    const result = await generateFurnitureDesign({
      furnitureType: project.furnitureType,
      dimensions: project.dimensions,
      features: project.features,
      materialPreference: project.materialPreference,
    });

    // Calculate pricing
    const materialsCost = estimateMaterialCost(result.technicalSpecs.cutList);
    const hardwareCost = estimateHardwareCost(result.technicalSpecs.hardware);
    const totalCost = materialsCost + hardwareCost;

    // Update project with technical specs
    project.technicalSpecs = result.technicalSpecs;
    project.estimatedCost = totalCost;
    project.status = 'generated';
    await project.save();

    // Create or update pricing info
    await PricingInfo.findOneAndUpdate(
      { projectId: project._id },
      {
        projectId: project._id,
        materialsCost,
        hardwareCost,
        finishingCost: 0,
        totalCost,
        currency: 'EUR',
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        project,
        generatedBy: result.generatedBy,
        processingTime: result.processingTime,
      },
      message: 'Furniture design generated successfully',
    });
  } catch (error: unknown) {
    console.error('Generate furniture error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate furniture design',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
