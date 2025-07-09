"use client";
import { useEffect, useState, useCallback } from "react";
import { useFeedback } from "../../context/FeedbackContext";

interface Listing {
  id: string;
  title: string;
  owner: string;
  price: number;
  status: string;
  createdAt: number;
  updatedAt: number;
  details: string;
}

const PAGE_SIZE = 10;
const API_URL = "https://686d7feec9090c4953867ba2.mockapi.io/api/listings/listings";

export default function DashboardTable() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { setFeedback } = useFeedback();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Listing>>({});

  
  const fetchListings = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?page=${pageNum}&limit=${PAGE_SIZE}`);
      const data = await res.json();
      setListings(data);
      
      const allRes = await fetch(`${API_URL}`);
      const allData = await allRes.json();
      setTotal(allData.length);
    } catch {
      setFeedback({ message: "Failed to fetch listings from mock API", type: "error" });
    }
    setLoading(false);
  }, [setFeedback]);

  useEffect(() => {
    fetchListings(page);
  }, [page, fetchListings]);

  
  const handleAction = async (id: string, action: "approve" | "reject") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected", updatedAt: Date.now() })
      });
      if (res.ok) {
        setFeedback({ message: `Listing ${action}d!`, type: "success" });
        fetchListings(page);
      } else {
        setFeedback({ message: "Action failed", type: "error" });
      }
    } catch {
      setFeedback({ message: "Action failed", type: "error" });
    }
    setLoading(false);
  };

  const handleEdit = (listing: Listing) => {
    setEditId(listing.id);
    setEditData(listing);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!editId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editData, updatedAt: Date.now() })
      });
      if (res.ok) {
        setFeedback({ message: "Listing updated!", type: "success" });
        setEditId(null);
        fetchListings(page);
      } else {
        setFeedback({ message: "Update failed", type: "error" });
      }
    } catch {
      setFeedback({ message: "Update failed", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 overflow-x-auto border border-gray-100 dark:border-gray-800">
      <table className="min-w-full text-sm rounded-lg overflow-hidden">
        <thead className="sticky top-0 z-10">
          <tr className="bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <th className="p-3 font-semibold">ID</th>
            <th className="p-3 font-semibold">Title</th>
            <th className="p-3 font-semibold">Owner</th>
            <th className="p-3 font-semibold">Price</th>
            <th className="p-3 font-semibold">Status</th>
            <th className="p-3 font-semibold">Details</th>
            <th className="p-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing, idx) => (
            <tr key={listing.id} className={
              `border-b last:border-0 transition hover:bg-blue-50 dark:hover:bg-gray-800 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-950'}`
            }>
              <td className="p-3" style={{textAlign: "center"}}>{listing.id}</td>
              <td className="p-3" style={{textAlign: "center"}}>
                {editId === listing.id ? (
                  <input
                    name="title"
                    value={editData.title || ""}
                    onChange={handleEditChange}
                    className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                ) : (
                  <span className="font-medium text-gray-900 dark:text-white">{listing.title}</span>
                )}
              </td>
              <td className="p-3" style={{textAlign: "center"}}>
                {editId === listing.id ? (
                  <input
                    name="owner"
                    value={editData.owner || ""}
                    onChange={handleEditChange}
                    className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                ) : (
                  <span className="text-gray-700 dark:text-gray-200">{listing.owner}</span>
                )}
              </td>
              <td className="p-3" style={{textAlign: "center"}}>
                {editId === listing.id ? (
                  <input
                    name="price"
                    type="number"
                    value={editData.price || 0}
                    onChange={handleEditChange}
                    className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                ) : (
                  <span className="text-blue-700 dark:text-blue-300 font-semibold">${listing.price}</span>
                )}
              </td>
              <td className="p-3" style={{textAlign: "center"}}>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold capitalize
                  ${listing.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                    listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'}`}
                >
                  {listing.status}
                </span>
              </td>
              <td className="p-3" style={{textAlign: "center"}}>
                {editId === listing.id ? (
                  <textarea
                    name="details"
                    value={editData.details || ""}
                    onChange={handleEditChange}
                    className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                ) : (
                  <span className="text-gray-600 dark:text-gray-300">{listing.details}</span>
                )}
              </td>
              <td className="p-3 flex gap-2 flex-wrap" style={{alignItems: "center", justifyContent: "center"}}>
                {editId === listing.id ? (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm font-semibold transition"
                      onClick={handleEditSave}
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded shadow-sm font-semibold transition"
                      onClick={() => setEditId(null)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm font-semibold transition"
                      onClick={() => handleEdit(listing)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow-sm font-semibold transition"
                      onClick={() => handleAction(listing.id, "approve")}
                      disabled={loading || listing.status === "approved"}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow-sm font-semibold transition"
                      onClick={() => handleAction(listing.id, "reject")}
                      disabled={loading || listing.status === "rejected"}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-2">
        <button
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Page {page} of {Math.ceil(total / PAGE_SIZE) || 1}
        </span>
        <button
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          onClick={() => setPage(p => p + 1)}
          disabled={page * PAGE_SIZE >= total || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
} 
