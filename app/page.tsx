'use client';

import { useState, useEffect } from 'react';
import { Car } from './types';
import CarList from './cars/page';

const Page = () => {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch('/api/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      }
    };
    fetchCars();
  }, []);

  const handleAddCar = async (name: string) => {
    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (response.ok) {
      const newCar = await response.json();
      setCars((prevCars) => [...prevCars, newCar]);
    }
  };

  const handleInspect = async (carId: string) => {
    const response = await fetch(`/api/inspections/${carId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        criteriaUpdates: [],
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const updatedCar = await response.json();
      setCars((prevCars) =>
        prevCars.map((car) => (car.id === carId ? updatedCar : car))
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Car Inspection App</h1>
      <CarList/>
    </div>
  );
};

export default Page;
