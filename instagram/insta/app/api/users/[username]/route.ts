import { InstagramApiError, instagramRequest } from "../../../lib/instagram-api";

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username } = await context.params;
  try {
    const profile = await instagramRequest(`/users/${encodeURIComponent(username)}`);
    return Response.json({ profile });
  } catch (error) {
    const apiError = error instanceof InstagramApiError ? error : new InstagramApiError("Could not load profile");
    return Response.json({ message: apiError.message }, { status: apiError.status });
  }
}
