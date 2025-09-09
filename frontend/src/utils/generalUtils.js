export const formatDate = isoDate => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getInitials = name =>
  name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

export const extractUsernameFromUrl = url => {
  if (!url) return '';

  try {
    // Remove trailing slashes and extract last part
    const cleanUrl = url.replace(/\/+$/, '');
    return cleanUrl.split('/').pop();
  } catch {
    return '';
  }
};
