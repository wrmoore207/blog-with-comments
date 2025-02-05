// Importing the Link component from Next.js for client-side navigation
import Link from "next/link";

// Importing the Container component to wrap the navigation for consistent styling
import Container from "../components/container";

// Defining the Header component, which renders the website's navigation bar
export default function Header() {
  return (
    // Header element with top and bottom padding
    <header className="py-6">
      {/* Using the Container component to center and style the navigation */}
      <Container>
        {/* Navigation bar with horizontal spacing between links */}
        <nav className="flex space-x-4">
          {/* Next.js Link component for navigation (preloads pages for better performance) */}
          <Link href="/">About</Link> 
          <Link href="/posts">Posts</Link>
          <Link href="/schedule">Schedule</Link> {/* New Schedule Page Link */}
        </nav>
      </Container>
    </header>
  );
}