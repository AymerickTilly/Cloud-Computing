export const uploadImage = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://yv9hvyex77.execute-api.ap-southeast-2.amazonaws.com/dev/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    console.error("Image upload failed");
    return null;
  }

  const data = await res.json();
  return data.imageUrl;
};
