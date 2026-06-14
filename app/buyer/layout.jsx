import BuyerNavBar from "../_components/BuyerNavBar/BuyerNavBar";

export default function BuyerLayout({ children }) {
  return (
    <>
      <BuyerNavBar />
      {children}
    </>
  );
}
