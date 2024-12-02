// app/page.tsx
import Link from "next/link";

const Page = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Car Inspection App</h1>
      <Link href="/cars">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Go to Car List
        </button>
      </Link>
    </div>
  );
};

export default Page;
