import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Criterion {
  id: string;
  isGood: boolean;
  note?: string | null;
}

// GET Request - Get car details by ID
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params; // Accessing the ID from params

  if (!id) {
    return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
  }

  // Fetch car by ID and include related criteria
  const car = await prisma.car.findUnique({
    where: { id },
    include: { criteria: true },
  });

  if (!car) {
    return NextResponse.json({ error: 'Car not found' }, { status: 404 });
  }

  return NextResponse.json(car);
}

// PUT Request - Update car inspection criteria by ID
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params; // Accessing the ID from params

  if (!id) {
    return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
  }

  // Parse the request body to get updated criteria
  const { criteria }: { criteria: Criterion[] } = await req.json();

  // Update criteria in the database
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

  // Recalculate car status based on criteria
  const updatedCriteria = await prisma.criteria.findMany({
    where: { carId: id },
  });

  const goodCriteriaCount = updatedCriteria.filter((c) => c.isGood).length;
  const newStatus = goodCriteriaCount === 5 ? 2 : goodCriteriaCount > 0 ? 1 : 0;

  // Update the car's status
  const updatedCar = await prisma.car.update({
    where: { id },
    data: { status: newStatus },
    include: { criteria: true },
  });

  return NextResponse.json(updatedCar); // Return the updated car
}
