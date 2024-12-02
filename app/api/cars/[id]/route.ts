import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Định nghĩa kiểu cho Criteria
interface Criterion {
  id: string;
  isGood: boolean;
  note?: string | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
    }

    // Xác định kiểu dữ liệu cho criteria
    const { criteria }: { criteria: Criterion[] } = await req.json();

    // Cập nhật các criteria
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

    // Tính toán lại trạng thái của xe
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
    console.error('Error updating car inspection:', error);
    return NextResponse.json({ error: 'Failed to update car inspection' }, { status: 500 });
  }
}
