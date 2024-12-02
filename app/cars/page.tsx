// app/cars/page.tsx
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Car {
  id: string
  name: string
  status: 0 | 1 | 2
}

const STATUS_LABELS = {
  0: "Not Inspected",
  1: "Inspecting", 
  2: "Inspected"
}

const STATUS_COLORS = {
  0: "text-red-500",
  1: "text-yellow-500",
  2: "text-green-500"
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch('/api/cars')
        if (!response.ok) {
          throw new Error('Failed to fetch cars')
        }
        const data = await response.json()
        setCars(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setIsLoading(false)
      }
    }

    fetchCars()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-xl">Loading cars...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {cars.length === 0 ? (
        <p className="text-gray-500">No cars found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Car Name</th>
                <th className="py-3 px-6 text-center">Inspection Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {cars.map((car) => (
                <tr 
                  key={car.id} 
                  className="border-b border-gray-200 hover:bg-gray-100 transition"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{car.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span 
                      className={`
                        px-3 py-1 rounded-full text-xs 
                        ${STATUS_COLORS[car.status]} 
                        bg-${STATUS_COLORS[car.status].replace('text-', '')}/10
                      `}
                    >
                      {STATUS_LABELS[car.status]}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link 
                      href={`/cars/${car.id}`} 
                      className="text-blue-600 hover:text-blue-900 transition"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}