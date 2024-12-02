import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      include: { criteria: true },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}
