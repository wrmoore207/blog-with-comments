

const clearUrl = (url: string) => {
  // Creates a new URL object from the provided string
  const { origin, pathname } = new URL(url);
  // Returns only the origin (protocol+domain) and pathname (path after domain)
  return `${origin}${pathname}`;
};

// Exports the function fo ruse in other files
export default clearUrl;