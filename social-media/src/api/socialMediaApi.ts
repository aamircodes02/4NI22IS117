const BASE_URL = "http://20.244.56.144/evaluation-service";

export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
}

export async function fetchUserPosts(userId: number) {
  const res = await fetch(`${BASE_URL}/users/${userId}/posts`);
  return res.json();
}

export async function fetchPostComments(postId: number) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  return res.json();
}
