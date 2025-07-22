import { useEffect, useState } from "react";
import { baseURI } from "../../common/baseURI";
import { toast } from "react-toastify";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseURI}/api/bookings/123456`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setBookings(data?.data);
      })
      .catch((err) =>{
        console.error("Error fetching bookings:", err);
      })
      .finally(()=> {
      setLoading(false);
    })
  }, []);

  const cancelBooking = async (id) => {
    try {
      const res = await fetch(`${baseURI}/api/bookings/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success(data.msg || "Booking cancelled");
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling booking");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Bookings</h2>
      {loading ? (
        <div className="text-center mt-8">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <ul className="space-y-5">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="border p-5 rounded-lg shadow-md flex justify-between items-start"
            >
              <div className="text-sm space-y-1">
                <p className="font-semibold text-lg">
                  Vehicle: {booking.vehicleName || ""}
                </p>
                <p>
                  📍 From Pincode:{" "}
                  <span className="font-medium">{booking.fromPincode}</span>
                </p>
                <p>
                  📍 To Pincode:{" "}
                  <span className="font-medium">{booking.toPincode}</span>
                </p>
                <p>
                  🕒 Start:{" "}
                  <span className="text-blue-600">
                    {new Date(booking.startTime).toLocaleString()}
                  </span>
                </p>
                <p>
                  🕒 End:{" "}
                  <span className="text-blue-600">
                    {new Date(booking.endTime).toLocaleString()}
                  </span>
                </p>
              </div>

              <button
                onClick={() => cancelBooking(booking._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
