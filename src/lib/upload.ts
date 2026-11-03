export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export function validateImageFile(file: File | null | undefined) {
  if (!file) return 'Please choose a cover image.';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    return 'Please choose a JPG, PNG, WEBP or GIF image.';
  if (file.size > MAX_IMAGE_BYTES)
    return 'The image is too large. Please choose one under 4 MB.';
  return null;
}

export async function uploadImage(file: File): Promise<string> {
  const problem = validateImageFile(file);
  if (problem) throw new Error(problem);

  const form = new FormData();
  form.append('image', file);

  const response = await fetch('/api/upload', { method: 'POST', body: form });
  const body = (await response.json().catch(() => null)) as {
    url?: string;
    message?: string;
  } | null;

  if (!response.ok || !body?.url) {
    throw new Error(body?.message || 'Image upload failed. Please try again.');
  }

  return body.url;
}
