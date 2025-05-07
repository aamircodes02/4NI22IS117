import { useEffect, useState } from "react";
import { fetchUsers, fetchUserPosts, fetchPostComments } from "../api/socialMediaApi";

interface TopUser {
  id: number;
  name: string;
  commentCount: number;
}

export const useTopUsers = () => {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopUsers = async () => {
      try {
        const users = await fetchUsers();
        const userCommentMap: Map<number, number> = new Map();

        for (const user of users) {
          const posts = await fetchUserPosts(user.id);
          let totalComments = 0;

          for (const post of posts) {
            const comments = await fetchPostComments(post.id);
            totalComments += comments.length;
          }

          userCommentMap.set(user.id, totalComments);
        }

        const top = [...userCommentMap.entries()]
          .map(([id, count]) => ({
            id,
            name: users.find(u => u.id === id)?.name || "Unknown",
            commentCount: count,
          }))
          .sort((a, b) => b.commentCount - a.commentCount)
          .slice(0, 5);

        setTopUsers(top);
        setLoading(false);
      } catch (error) {
        console.error("Error loading top users:", error);
      }
    };

    loadTopUsers();
  }, []);

  return { topUsers, loading };
};
