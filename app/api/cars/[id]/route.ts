import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Criteria } from '@/app/types';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');

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
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    const { criteria }: { criteria: Criteria[] } = await req.json();

    // Update individual criteria
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

    // Recalculate car status
    const updatedCriteria = await prisma.criteria.findMany({
      where: { carId: id },
    });

    const goodCriteriaCount = updatedCriteria.filter((c) => c.isGood).length;
    const newStatus = goodCriteriaCount === 5 ? 2 : goodCriteriaCount > 0 ? 1 : 0;

    const updatedCar = await prisma.car.update({
      where: { id },
      data: { status: newStatus },
      include: { criteria: true },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to update car inspection' }, { status: 500 });
  }
}
