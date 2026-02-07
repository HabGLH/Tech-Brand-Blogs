export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
};
export const getIdFromRequest = (req: Request): string | null => {
  const { searchParams } = new URL(req.url);
  return searchParams.get("id");
};
