export const getUTF8Data = (data: string) => {
  const buffer = Buffer.from(data, "binary");
  const utf8Data = buffer.toString("utf8");
  return utf8Data.replaceAll("�", "");
};
