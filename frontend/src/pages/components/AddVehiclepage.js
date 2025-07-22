import { useState } from "react";
import { baseURI } from "../../common/baseURI";
import { toast } from "react-toastify";

export default function AddVehiclePage() {
  const [formData, setFormData] = useState({
    name: "",
    capacityKg: "",
    tyres: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(baseURI + "/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json(); 

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success(data.msg || "Vehicle added successfully");
      setFormData({ name: "", capacityKg: "", tyres: "" });
    } catch (err) {
      toast.error("Error: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Add New Vehicle
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Truck"
              required
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity (KG)
            </label>
            <input
              name="capacityKg"
              type="number"
              value={formData.capacityKg}
              onChange={handleChange}
              placeholder="e.g., 1000"
              required
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Tyres
            </label>
            <input
              name="tyres"
              type="number"
              value={formData.tyres}
              onChange={handleChange}
              placeholder="e.g., 4"
              required
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
          >
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}
