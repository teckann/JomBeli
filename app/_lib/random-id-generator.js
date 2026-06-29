export async function IDGenerator() {
  const res = await fetch("https://www.uuidtools.com/api/generate/v4");
  const data = await res.json();

  return data[0];
}

export function GeneralIDGenerator() {
  return Math.floor(Math.random() * 1000000) + Date.now();
}
