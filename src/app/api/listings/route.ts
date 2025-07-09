import { NextRequest } from "next/server";

const listings = [
  {
    id: 1,
    title: "Toyota Camry 2020",
    owner: "John Doe",
    price: 50,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    details: "Comfortable sedan, automatic, 4 seats, AC."
  },
  {
    id: 2,
    title: "Honda Civic 2019",
    owner: "Jane Smith",
    price: 45,
    status: "approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    details: "Reliable, fuel efficient, 4 seats, manual."
  },
  {
    id: 3,
    title: "Ford Mustang 2021",
    owner: "Mike Brown",
    price: 90,
    status: "rejected",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    details: "Sporty coupe, V8, 2 seats, red."
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const status = searchParams.get("status");
  let filtered = listings;
  if (status) filtered = filtered.filter(l => l.status === status);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);
  return Response.json({
    listings: paginated,
    total: filtered.length,
    page,
    pageSize
  });
}

export async function PATCH(req: NextRequest) {
  const { id, action } = await req.json();
  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) return Response.json({ error: "Listing not found" }, { status: 404 });
  if (action === "approve" || action === "reject") {
    listings[idx].status = action === "approve" ? "approved" : "rejected";
    listings[idx].updatedAt = new Date().toISOString();
    return Response.json({ success: true, listing: listings[idx] });
  }
  return Response.json({ error: "Invalid action" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.id) return Response.json({ error: "Missing id" }, { status: 400 });
  const idx = listings.findIndex(l => l.id === data.id);
  if (idx === -1) return Response.json({ error: "Listing not found" }, { status: 404 });
  listings[idx] = { ...listings[idx], ...data, updatedAt: new Date().toISOString() };
  return Response.json({ success: true, listing: listings[idx] });
} 