import { useEffect, useState } from "react";
import { fetchUsers, fetchUserPosts } from "../api/socialMediaApi";

export interface Post {
  id: number;
  userId: number;
  content: string;
  timestamp: string; // assuming timestamp field exists
}

export interface User {
  id: number;
  name: string;
}

export function useFeedData() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Map for faster user lookup
  const userMap = new Map(users.map(user => [user.id, user]));

  const loadData = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);

      const allPosts = await Promise.all(
        usersData.map((user: User) => fetchUserPosts(user.id))
      );

      const flattenedPosts = allPosts.flat();

      // Sort by newest timestamp
      flattenedPosts.sort((a: Post, b: Post) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setPosts(flattenedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error loading feed data:", error);
    }
  };

  useEffect(() => {
    loadData();

    // Polling for updates every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  return { posts, users, userMap, loading };
}
