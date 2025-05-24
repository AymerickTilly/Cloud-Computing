// /api/deleteImage.ts
import { getIdToken } from "../auth/AuthStore"; // Adjust path if needed

export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    const idToken = await getIdToken();
    console.log("ID Token from deleteImage:", idToken);

    if (!idToken) {
      console.error("No ID token available");
      return false;
    }

    // Extract the image key from the imageUrl (e.g., the S3 key)
    const imageKey = imageUrl.split(".com/")[1]; // Adjust based on your S3 URL structure

    const res = await fetch(
      "https://yv9hvyex77.execute-api.ap-southeast-2.amazonaws.com/dev/image",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ imageKey }),
      }
    );

    if (!res.ok) {
      console.error("Image deletion failed deleteImage.ts:", res.status, res.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting image deleteImage.ts:", error);
    return false;
  }
}