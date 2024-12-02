import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Criterion {
  id: string;
  isGood: boolean;
  note?: string | null;
}

export async function GET(req: NextRequest, res: NextResponse, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    console.log(req.json());
    console.log(res.json());

    if (!id) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    const car = await prisma.car.findUnique({
      where: { id },
      include: { criteria: true },
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextResponse, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    console.log(res.json());

    if (!id) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    // Get the `criteria` from the request body
    const { criteria }: { criteria: Criterion[] } = await req.json();

    // Update the criteria
    const updatePromises = criteria.map(async (criterion) => {
      await prisma.criteria.update({
        where: { id: criterion.id },
        data: {
          isGood: criterion.isGood,
          note: criterion.isGood ? null : criterion.note,
        },
      });
    });

    await Promise.all(updatePromises);

    // Recalculate the car status based on updated criteria
    const updatedCriteria = await prisma.criteria.findMany({
      where: { carId: id },
    });

    const goodCriteriaCount = updatedCriteria.filter((c) => c.isGood).length;
    const newStatus = goodCriteriaCount === 5 ? 2 : goodCriteriaCount > 0 ? 1 : 0;

    // Update the car status in the database
    const updatedCar = await prisma.car.update({
      where: { id },
      data: { status: newStatus },
      include: { criteria: true },
    });

    return NextResponse.json(updatedCar); // Return the updated car
  } catch (error) {
    console.error('Error updating car inspection:', error);
    return NextResponse.json({ error: 'Failed to update car inspection' }, { status: 500 });
  }
}
