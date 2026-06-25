import { StopProvider } from "@/app/_context/StopContext";

export default function CourierNavLayout({ children }) {
  return (
    <>
      <StopProvider>
        {children}
      </StopProvider>
    </>
  );
}
