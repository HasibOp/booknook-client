import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/upload";

const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

function looksLikeImage(bytes: Uint8Array) {
  const startsWith = (...values: number[]) => values.every((value, index) => bytes[index] === value);
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  return (
    startsWith(0xff, 0xd8, 0xff) ||
    startsWith(0x89, 0x50, 0x4e, 0x47) ||
    ascii(0, 3) === "GIF" ||
    (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP")
  );
}

const fail = (status: number, message: string) => NextResponse.json({ message }, { status });

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return fail(401, "Please log in to upload images.");

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) return fail(500, "Image upload is not set up yet. Please try again later.");

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "Please choose an image to upload.");
  }

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) return fail(400, "Please choose an image to upload.");
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return fail(400, "Please choose a JPG, PNG, WEBP or GIF image.");
  if (file.size > MAX_IMAGE_BYTES) return fail(413, "The image is too large. Please choose one under 4 MB.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!looksLikeImage(bytes)) return fail(400, "That file is not a valid image.");

  const upstream = new FormData();
  upstream.append("image", new Blob([bytes], { type: file.type }), file.name || "cover");

  try {
    const response = await fetch(`${IMGBB_ENDPOINT}?key=${apiKey}`, { method: "POST", body: upstream });
    const result = (await response.json().catch(() => null)) as
      | { success?: boolean; data?: { url?: string } }
      | null;

    if (!response.ok || !result?.success || !result.data?.url) {
      return fail(502, "The image service rejected the upload. Please try a different image.");
    }

    return NextResponse.json({ url: result.data.url });
  } catch {
    return fail(502, "Could not reach the image service. Please try again in a moment.");
  }
}
