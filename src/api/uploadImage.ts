import { getAccessToken } from "../auth/AuthStore"; // adjust path

export const uploadImage = async (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const result = reader.result;
      if (typeof result !== "string") {
        console.error("FileReader result was not a string");
        resolve(null);
        return;
      }

      const fileData = result.split(",")[1]; // Base64 payload
      const fileType = file.type;

      try {
        // Get Cognito token
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.error("No access token available");
          resolve(null);
          return;
        }

        const res = await fetch(
          "https://yv9hvyex77.execute-api.ap-southeast-2.amazonaws.com/dev/image",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ fileData, fileType }),
          }
        );

        if (!res.ok) {
          console.error("Image upload failed:", res.status, res.statusText);
          resolve(null);
          return;
        }

        const data = await res.json();
        resolve(data.imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        resolve(null);
      }
    };

    reader.onerror = () => {
      console.error("FileReader error");
      resolve(null);
    };

    reader.readAsDataURL(file);
  });
};
