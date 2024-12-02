"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Car } from "@/app/types";

export default function CarInspectionPage() {
  const params = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchCarDetails();
  }, [params.id]);

  const fetchCarDetails = async () => {
    const response = await fetch(`/api/cars/${params.id}`);
    const data = await response.json();
    setCar(data);
  };

  const updateCriteria = async () => {
    if (!car) return;

    const response = await fetch(`/api/cars/${car.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ criteria: car.criteria }),
    });
    const updatedCar = await response.json();
    setCar(updatedCar);
  };

  const toggleCriterion = (criterionId: string) => {
    if (!car) return;
  
    // Keep note either tick or untick checkbox
    const updatedCriteria = car.criteria.map((criterion) =>
      criterion.id === criterionId
        ? { 
            ...criterion, 
            isGood: !criterion.isGood
          }
        : criterion
    ); 
    setCar({ ...car, criteria: updatedCriteria });
  };
  
  // Update note with criteria
  const updateNote = (criterionId: string, note: string) => {
    if (!car) return;
  
    const updatedCriteria = car.criteria.map((criterion) =>
      criterion.id === criterionId
        ? { ...criterion, note }
        : criterion
    );
    setCar({ ...car, criteria: updatedCriteria });
  };
  

  if (!car) return <div className="text-center w-full">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inspect {car.name}</h1>
        <span
          className={`px-4 py-2 rounded-full text-white ${
            car.status === 0
              ? "bg-gray-500"
              : car.status === 1
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        >
          {car.status === 0 ? "Pending" : car.status === 1 ? "In Progress" : "Completed"}
        </span>
      </div>

      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4">Inspection Criteria</h2>
        {car.criteria.map((criterion) => (
          <div key={criterion.id} className="mb-4 flex items-center space-x-4">
            <input
              type="checkbox"
              checked={criterion.isGood}
              onChange={() => toggleCriterion(criterion.id)}
              id={`criterion-${criterion.id}`}
              className="h-5 w-5"
            />
            <label htmlFor={`criterion-${criterion.id}`} className="flex-grow text-sm font-medium">
              {criterion.name}
            </label>
            {!criterion.isGood && (
              <textarea
                value={criterion.note || ""}
                onChange={(e) => updateNote(criterion.id, e.target.value)}
                placeholder="Note for failed criteria"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        ))}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={updateCriteria}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
