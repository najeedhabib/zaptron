export function isTimeToFollowUp(first_contacted_date: string): boolean {
  const contactedTime = new Date(first_contacted_date).getTime();
  const now = Date.now();
  const diffHours = (now - contactedTime) / (1000 * 60 * 60);
  return diffHours >= 24;
}