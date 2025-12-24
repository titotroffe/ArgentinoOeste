console.log("Hello Sanity Environment Checks");
console.log("Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log("Token available:", !!process.env.SANITY_SESSION_TOKEN || !!process.env.SANITY_API_TOKEN);
