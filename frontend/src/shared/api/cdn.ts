export const CDN_UPLOAD_URL =
  process.env.NEXT_PUBLIC_CDN_UPLOAD_URL || "http://localhost:4001/images";

type UploadImageResponse = {
  data: {
    contentType: string;
    path: string;
    size: number;
    url: string;
  };
};

export const uploadImageToCdn = async (file: File) => {
  const response = await fetch(CDN_UPLOAD_URL, {
    body: file,
    credentials: "include",
    headers: {
      "Content-Type": file.type,
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`CDN upload error: ${response.status} ${response.statusText}`);
  }

  const result = (await response.json()) as UploadImageResponse;
  return result.data;
};
