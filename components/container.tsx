// Defining the type for the component props
type ContainerProps = {
  children: React.ReactNode; // Accepts any valid React element(s) as children
};

// Defining the Container component, which acts as a layout wrapper
export default function Container({ children }: ContainerProps) {
  return (
    // Wrapper div that styles the content area
    <div className="container max-w-2xl m-auto px-4">
      {children} {/* Renders any child components or elements passed into this component */}
    </div>
  );
}
