import { useEffect, useState } from "react";
import { fetchUsers, fetchUserPosts, fetchPostComments } from "../api/socialMediaApi";

interface TrendingPost {
  id: number;
  title: string;
  body: string;
  commentCount: number;
  userName: string;
}

export const useTrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingPosts = async () => {
      try {
        const users = await fetchUsers();
        const postCommentMap: TrendingPost[] = [];

        for (const user of users) {
          const posts = await fetchUserPosts(user.id);

          for (const post of posts) {
            const comments = await fetchPostComments(post.id);
            postCommentMap.push({
              id: post.id,
              title: post.title,
              body: post.body,
              commentCount: comments.length,
              userName: user.name,
            });
          }
        }

        const maxCount = Math.max(...postCommentMap.map(p => p.commentCount));

        const trending = postCommentMap.filter(p => p.commentCount === maxCount);
        setTrendingPosts(trending);
        setLoading(false);
      } catch (err) {
        console.error("Error loading trending posts", err);
      }
    };

    loadTrendingPosts();
  }, []);

  return { trendingPosts, loading };
};
