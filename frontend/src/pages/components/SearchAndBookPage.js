import { useState } from "react";
import { toast } from "react-toastify";
import { baseURI } from "../../common/baseURI";

export default function SearchAndBookPage() {
  const [form, setForm] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [estimatedRideDurationHours, setEstimatedRideDurationHours] =
    useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams(form).toString();
      const res = await fetch(
        baseURI + `/api/vehicles/available?${queryParams}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed");
      }

      setVehicles(data?.availableVehicles || []);
      setEstimatedRideDurationHours(data?.estimatedRideDurationHours);
      toast.success(data?.msg);
    } catch (err) {
      toast.error("Search error: " + (err.message || "Unknown error"));
    }
  };

  const handleBook = async (vehicleId,vehicleName) => {
    try {
      const res = await fetch(baseURI+"/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleId,
          customerId: "123456",
          fromPincode: form.fromPincode,
          toPincode: form.toPincode,
          startTime: form.startTime,
          vehicleName:vehicleName
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      toast.success(data?.msg);
    } catch (err) {
      toast.error(err.message || "Unknown error");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Search & Book Vehicle</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          name="capacityRequired"
          value={form.capacityRequired}
          onChange={handleChange}
          placeholder="Capacity Required (KG)"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="fromPincode"
          value={form.fromPincode}
          onChange={handleChange}
          placeholder="From Pincode"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          name="toPincode"
          value={form.toPincode}
          onChange={handleChange}
          placeholder="To Pincode"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
      >
        Search Availability
      </button>

      <div className="mt-8 space-y-6">
        {vehicles?.map((v) => (
          <div key={v._id} className="border p-4 rounded-lg shadow-sm">
            <p>
              <span className="font-semibold">Name:</span> {v.name}
            </p>
            <p>
              <span className="font-semibold">Capacity:</span> {v.capacityKg} KG
            </p>
            <p>
              <span className="font-semibold">Tyres:</span> {v.tyres}
            </p>
            <p>
         
              <span className="font-semibold">Estimated time duration:</span>{" "}
              {estimatedRideDurationHours}
            </p>
            <button
              onClick={() => handleBook(v._id,v.name)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
