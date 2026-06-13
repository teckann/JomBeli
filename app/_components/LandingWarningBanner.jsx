import styles from "../_component_styles/LandingWarningBanner.module.css";

function LandingWarningBanner({ message }) {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
}

export default LandingWarningBanner;
