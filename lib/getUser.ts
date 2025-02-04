/**
 * Retrieves user info from Auth0 using acces token
 * @param token 
 * @returns js object of user's data
 */

export default async function getUser(token: string) {
  // Make a request to the Auth0 'userinfo' endpoint with the provided token
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/userinfo`, // Auth0 user info endpoint
    {
      headers: {
        Authorization: `Bearer ${token}`, // Include the access token for authentication
        "Content-Type": "application/json", // Specify JSON response format
      },
    },
  );
  return await response.json();
}
