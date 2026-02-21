// removeBg.js
export async function removeBackgroundApi(base64Image) {
  const blob = await (await fetch(base64Image)).blob();

  const formData = new FormData();
  formData.append("image_file", blob);
  formData.append("size", "auto");

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": "YOUR_API_KEY_HERE", // 🔴 put your API key
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Background removal failed");
  }

  const resultBlob = await res.blob();
  return URL.createObjectURL(resultBlob);
}