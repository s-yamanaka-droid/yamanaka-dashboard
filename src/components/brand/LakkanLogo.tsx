import styles from "./LakkanLogo.module.css";

type Props = {
  variant?: "wordmark" | "signature";
  size?: "small" | "default" | "feature";
  inverse?: boolean;
};

/** English-only by default. Reserve the signature for company introductions. */
export function LakkanLogo({ variant = "wordmark", size = "default", inverse = false }: Props) {
  const signature = variant === "signature";
  return (
    <svg
      className={`${styles.logo} ${styles[size]} ${inverse && !signature ? styles.inverse : ""}`}
      data-lakkan-logo={variant}
      viewBox={signature ? "139 216 1712 366" : "75 170 1830 438"}
      width={signature ? 1712 : 1830}
      height={signature ? 366 : 438}
      role="img"
      aria-label={signature ? "Lakkan 楽観" : "Lakkan"}
      focusable="false"
    >
      <image
        href={`/brand/lakkan-logo/lakkan-a3-${variant}.png`}
        width="1983"
        height="793"
      />
    </svg>
  );
}
