// Generate a URL-friendly slug from the provided text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters, spaces, and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

export function generateUniqueOrder(order?: number) {
  return order ? order + 1 : 1;
}

export function isValidUniqueOrder(order: number, chapterOrders: number[]) {
  const chapterWithSameOrderFound = chapterOrders.find(
    (chapterOrder) => chapterOrder === order,
  );

  if (chapterWithSameOrderFound) {
    return false;
  }

  return true;
}

export function isValidUniqueTitle(title: string, chaptersTitle: string[]) {
  const chapterWithSameTitleFound = chaptersTitle.find(
    (chapterOrder) => chapterOrder === title,
  );

  if (chapterWithSameTitleFound) {
    return false;
  }

  return true;
}
