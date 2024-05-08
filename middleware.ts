import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

//adding the protected route in middleware
const protectedRoute = createRouteMatcher([
  "/",
  "/upcoming",
  "/previous",
  "/recordings",
  "/personal-room",
  "/meeting(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (protectedRoute(req)) auth().protect();
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
