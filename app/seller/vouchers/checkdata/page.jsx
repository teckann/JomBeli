import { getSellerVoucher } from "@/app/_lib/data-services";

export default async function DebugPage() {
  // Pass a real user ID to test it
  const data = await getSellerVoucher("928b6b94-3e25-4aba-93d1-2d3c8df29b40");

  return (
    <pre style={{ padding: '20px', background: '#0f172a', color: '#38bdf8', fontSize: '14px' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}