"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Car } from "@/app/types";

export default function CarInspectionPage() {
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCarDetails();
  }, [params.id]);

  const fetchCarDetails = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors
    try {
      const response = await fetch(`/api/cars/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch car details");
      const data = await response.json();
      setCar(data);
    } catch (err) {
      setError("Error loading car details");
    } finally {
      setLoading(false);
    }
  };

  const updateCriteria = async () => {
    if (!car) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/cars/${car.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria: car.criteria }),
      });
      if (!response.ok) throw new Error("Failed to update criteria");
      const updatedCar = await response.json();
      setCar(updatedCar);
    } catch (err) {
      setError("Error updating car inspection");
    } finally {
      setLoading(false);
    }
  };

  const toggleCriterion = (criterionId: string) => {
    if (!car) return;

    const updatedCriteria = car.criteria.map((criterion) =>
      criterion.id === criterionId
        ? { ...criterion, isGood: !criterion.isGood }
        : criterion
    );
    setCar({ ...car, criteria: updatedCriteria });
  };

  const updateNote = (criterionId: string, note: string) => {
    if (!car) return;

    const updatedCriteria = car.criteria.map((criterion) =>
      criterion.id === criterionId
        ? { ...criterion, note }
        : criterion
    );
    setCar({ ...car, criteria: updatedCriteria });
  };

  if (loading) return <div className="text-center w-full">Loading...</div>;

  if (error) return <div className="text-center w-full text-red-500">{error}</div>;

  if (!car) return <div className="text-center w-full">No car data found</div>;

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
          {car.status === 0
            ? "Pending"
            : car.status === 1
            ? "In Progress"
            : "Completed"}
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
            disabled={loading}
            className={`px-4 py-2 ${loading ? "bg-gray-500" : "bg-blue-500"} text-white rounded-md hover:bg-blue-600`}
          >
            {loading ? "Saving..." : "Save Inspection"}
          </button>
        </div>
      </div>
    </div>
  );
}
