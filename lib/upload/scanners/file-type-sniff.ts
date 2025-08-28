import { fileTypeFromBuffer } from 'file-type';

export async function sniffFileType(buffer: Buffer) {
  const type = await fileTypeFromBuffer(buffer);
  return type?.mime;
}
