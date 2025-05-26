import { getIdToken } from "../auth/AuthStore";

export async function loadOrdersById(orderId: string) {
  const idToken = await getIdToken();
  console.log("ID Token:", idToken);

  if (!idToken) {
    console.error("No ID token available");
    return null;
  }

  const url = `https://yv9hvyex77.execute-api.ap-southeast-2.amazonaws.com/dev/cart?userId=${encodeURIComponent(orderId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch orders ${orderId}: ${res.status}`);
  }

  return res.json();
}