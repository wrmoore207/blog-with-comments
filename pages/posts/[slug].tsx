// Importing necessary types and components from Next.js and other modules
import type { InferGetStaticPropsType } from "next"; // Infers the type of props returned by getStaticProps
import { useRouter } from "next/router"; // Next.js hook for handling routing
import ErrorPage from "next/error"; // Next.js error page component for handling 404 errors
import Comment from "../../components/comment"; // Importing the Comment component for the comment section
import Container from "../../components/container"; // Layout component for consistent spacing
import distanceToNow from "../../lib/dateRelative"; // Function to format date into a human-readable time (e.g., "3 days ago")
import { getAllPosts, getPostBySlug } from "../../lib/getPost"; // Functions to fetch post data
import markdownToHtml from "../../lib/markdownToHtml"; // Converts Markdown content to HTML
import Head from "next/head"; // Allows dynamic modification of the <head> section (SEO, titles, etc.)

/**
 * --- COMPONENT: PostPage ---
 * Renders a blog post dynamically based on the slug from the URL.
 * @param {InferGetStaticPropsType<typeof getStaticProps>} post - The post data fetched via getStaticProps.
 */
export default function PostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter(); // Gets access to the Next.js router

  // If the page is not in fallback mode and the post does not exist, show a 404 error page
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Container>
      {/* Dynamically set the page title based on the post's title */}
      <Head>
        <title>{post.title} | My awesome blog</title>
      </Head>

      {/* If Next.js is still generating the page, show a loading state */}
      {router.isFallback ? (
        <div>Loading…</div>
      ) : (
        <div>
          <article>
            {/* Blog post header */}
            <header>
              <h1 className="text-4xl font-bold">{post.title}</h1>
              
              {/* Display the post excerpt if available */}
              {post.excerpt ? (
                <p className="mt-2 text-xl">{post.excerpt}</p>
              ) : null}
              
              {/* Display the post's publication date in a relative format */}
              <time className="flex mt-2 text-gray-400">
                {distanceToNow(new Date(post.date))}
              </time>
            </header>

            {/* Render the post content as HTML, converted from Markdown */}
            <div
              className="prose mt-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

          </article>

          {/* Display the comment section below the post */}
          <Comment />
        </div>
      )}
    </Container>
  );
}

// Type definition for the function parameters used in getStaticProps
type Params = {
  params: {
    slug: string;
  };
};

/**
 * --- FUNCTION: getStaticProps ---
 * Fetches data for a single post based on the slug.
 * Runs at build time to generate static pages.
 * @param {Params} params - The dynamic route parameter containing the post slug.
 * @returns {object} - The post data as props.
 */
export async function getStaticProps({ params }: Params) {
  // Retrieve post metadata and content using the slug
  const post = getPostBySlug(params.slug, [
    "slug",
    "title",
    "excerpt",
    "date",
    "content",
  ]);

  // Convert the Markdown content into HTML
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content, // Replace raw Markdown content with HTML
      },
    },
  };
}

/**
 * --- FUNCTION: getStaticPaths ---
 * Determines which post pages should be generated at build time.
 * @returns {object} - Paths for dynamic post pages and fallback behavior.
 */
export async function getStaticPaths() {
  // Retrieve all post slugs
  const posts = getAllPosts(["slug"]);

  return {
    // Generate paths for each post based on its slug
    paths: posts.map(({ slug }) => {
      return {
        params: {
          slug,
        },
      };
    }),
    fallback: false, // Return 404 if the slug is not found
  };
}