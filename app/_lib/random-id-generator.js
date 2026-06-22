async function IDGenerator() {
  const res = await fetch("https://www.uuidtools.com/api/generate/v4");
  const data = await res.json();
  console.log(data[0]);
}

IDGenerator();
IDGenerator();
