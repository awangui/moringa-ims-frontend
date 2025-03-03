import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

function AddRoom() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!formData.name.trim() || !formData.description.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://172.236.2.18:5050/locations/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add room");

      // Navigate back to spaces page after success
      navigate("/spaces");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navigation>
      <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto mt-8">
        <h1 className="text-2xl font-bold text-[#0D2240] mb-4">Add New Room</h1>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Room Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-[#FF6B35] focus:outline-none"
              placeholder="Enter room name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-[#FF6B35] focus:outline-none"
              placeholder="Enter room description"
            ></textarea>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/spaces")}
              className="bg-gray-300 text-[#0D2240] px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0D2240] text-white px-4 py-2 rounded-md hover:bg-[#FF6B35]"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </Navigation>
  );
}

export default AddRoom;
