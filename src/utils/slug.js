export const breedToSlug = (name) => {
  if (!name || typeof name !== 'string') return 'unknown-breed';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
