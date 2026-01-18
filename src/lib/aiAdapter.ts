import { generateFurniture, FurnitureSpecification } from './furnitureEngine';
import { ITechnicalSpecs } from '@/models/Project';

/**
 * AI Adapter - Abstraction layer between application and AI/rules engine
 * 
 * Currently uses rule-based furniture generation.
 * Future: Can be swapped to use AI model by changing implementation.
 */

const USE_AI_MODEL = process.env.USE_AI_MODEL === 'true';
const AI_MODEL_API_URL = process.env.AI_MODEL_API_URL;
const AI_MODEL_API_KEY = process.env.AI_MODEL_API_KEY;

export interface GenerateFurnitureRequest {
  furnitureType: 'corner_shelf' | 'wall_shelf' | 'cabinet' | 'desk';
  dimensions: {
    width: number;
    depth: number;
    height: number;
    cornerAngle?: number;
  };
  features: {
    hasFootplates: boolean;
    numShelves?: number;
    numDrawers?: number;
    hasDoors: boolean;
    hasBackPanel: boolean;
    adjustableShelves: boolean;
    loadCapacityKg?: number;
  };
  materialPreference: string;
}

export interface GenerateFurnitureResponse {
  technicalSpecs: ITechnicalSpecs;
  generatedBy: 'rules' | 'ai';
  processingTime: number;
}

/**
 * Generate furniture design using current method (rules or AI)
 */
export async function generateFurnitureDesign(
  request: GenerateFurnitureRequest
): Promise<GenerateFurnitureResponse> {
  const startTime = Date.now();

  try {
    if (USE_AI_MODEL && AI_MODEL_API_URL) {
      // Future: AI Model integration
      return await generateWithAI(request);
    } else {
      // Current: Rule-based generation
      return await generateWithRules(request);
    }
  } catch (error) {
    console.error('Error generating furniture design:', error);
    throw new Error('Failed to generate furniture design');
  } finally {
    const processingTime = Date.now() - startTime;
    console.log(`Furniture generation took ${processingTime}ms`);
  }
}

/**
 * Generate using rule-based engine (CURRENT METHOD)
 */
async function generateWithRules(
  request: GenerateFurnitureRequest
): Promise<GenerateFurnitureResponse> {
  const spec: FurnitureSpecification = {
    furnitureType: request.furnitureType,
    dimensions: request.dimensions,
    features: request.features,
    materialPreference: request.materialPreference,
  };

  const technicalSpecs = generateFurniture(spec);
  const processingTime = Date.now() - Date.now();

  return {
    technicalSpecs,
    generatedBy: 'rules',
    processingTime,
  };
}

/**
 * Generate using AI model (FUTURE METHOD)
 */
async function generateWithAI(
  request: GenerateFurnitureRequest
): Promise<GenerateFurnitureResponse> {
  if (!AI_MODEL_API_URL || !AI_MODEL_API_KEY) {
    throw new Error('AI model not configured');
  }

  try {
    const response = await fetch(AI_MODEL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_MODEL_API_KEY}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - Date.now();

    return {
      technicalSpecs: data.technicalSpecs,
      generatedBy: 'ai',
      processingTime,
    };
  } catch (error) {
    console.error('AI generation failed, falling back to rules:', error);
    // Fallback to rules if AI fails
    return await generateWithRules(request);
  }
}

/**
 * Check if AI model is available
 */
export function isAIAvailable(): boolean {
  return USE_AI_MODEL && !!AI_MODEL_API_URL && !!AI_MODEL_API_KEY;
}

/**
 * Get current generation method
 */
export function getCurrentMethod(): 'rules' | 'ai' {
  return isAIAvailable() ? 'ai' : 'rules';
}
