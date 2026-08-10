export function sumDailyCounts(entries) {
  if (!entries) return undefined;
  return entries.reduce((sum, entry) => sum + (entry.count ?? 0), 0);
}
