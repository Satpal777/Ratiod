export function Button({ 
  children, 
  variant = "primary", 
  className = "", 
  ...props 
}) {
  const baseClass = "button";
  const variantClass = `button-${variant}`;
  
  return (
    <button className={`${baseClass} ${variantClass} ${className}`} type="button" {...props}>
      {children}
    </button>
  );
}
