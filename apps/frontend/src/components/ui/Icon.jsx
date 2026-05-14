export function Icon({ name }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "1.7",
  };

  const paths = {
    arrow: (
      <>
        <path {...stroke} d="M7 17 17 7" />
        <path {...stroke} d="M9 7h8v8" />
      </>
    ),
    play: <path {...stroke} d="M9 7v10l8-5-8-5Z" />,
    bolt: <path {...stroke} d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z" />,
    mask: (
      <>
        <path {...stroke} d="M4 9c2-2 4.7-3 8-3s6 1 8 3v3.5c0 3.2-3.2 5.5-8 5.5s-8-2.3-8-5.5V9Z" />
        <path {...stroke} d="M8 12h3M13 12h3M9.5 15c1.7.8 3.3.8 5 0" />
      </>
    ),
    clock: (
      <>
        <path {...stroke} d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path {...stroke} d="M12 8v4l3 2" />
      </>
    ),
    chart: (
      <>
        <path {...stroke} d="M4 19V5M4 19h16" />
        <path {...stroke} d="M8 15v-4M12 15V8M16 15v-6" />
      </>
    ),
    logout: (
      <>
        <path {...stroke} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline {...stroke} points="16 17 21 12 16 7" />
        <line {...stroke} x1="21" y1="12" x2="9" y2="12" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      {paths[name]}
    </svg>
  );
}

export function FeatureIcon({ name }) {
  return (
    <span className="feature-icon">
      <Icon name={name} />
    </span>
  );
}

export function Spark({ className = "" }) {
  return (
    <svg className={`spark ${className}`} viewBox="0 0 42 42" aria-hidden="true">
      <path d="M21 2 25 17 40 21 25 25 21 40 17 25 2 21 17 17 21 2Z" />
    </svg>
  );
}

export function DoodleArrow({ className = "" }) {
  return (
    <svg className={`doodle-arrow ${className}`} viewBox="0 0 120 72" aria-hidden="true">
      <path d="M8 53C28 18 70 13 105 31" />
      <path d="m94 18 15 16-22 4" />
    </svg>
  );
}

export function MiniBars({ className = "" }) {
  return (
    <svg className={`mini-bars ${className}`} viewBox="0 0 130 70" aria-hidden="true">
      <rect x="8" y="42" width="16" height="20" rx="5" />
      <rect x="34" y="28" width="16" height="34" rx="5" />
      <rect x="60" y="14" width="16" height="48" rx="5" />
      <rect x="86" y="22" width="16" height="40" rx="5" />
      <path d="M9 18c18 8 31 8 45-2s28-8 58 4" />
    </svg>
  );
}
