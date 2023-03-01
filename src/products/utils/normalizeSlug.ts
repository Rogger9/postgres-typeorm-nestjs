export const normalizeSlug = (slug: string): string => slug.toLowerCase().replaceAll("'", '').replaceAll(' ', '_')
