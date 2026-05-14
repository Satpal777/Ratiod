export function ShellCard({ children, className = "" }) {
  return (
    <div className={`shell-card ${className}`}>
      {children}
    </div>
  );
}

export function ShellInner({ children, className = "" }) {
  return (
    <div className={`shell-inner ${className}`}>
      {children}
    </div>
  );
}
