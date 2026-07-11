export async function fileToBuffer(file: File): Promise<Buffer> {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes);
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = await fileToBuffer(file);

  const mime = file.type;
  const base64 = buffer.toString("base64");

  return `data:${mime};base64,${base64}`;
}