// src/pages/Feed.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  CircularProgress,
} from "@mui/material";

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get<Post[]>(
        "http://20.244.56.144/evaluation-service/posts"
      );
      // Show newest posts at the top
      setPosts(res.data.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Initial fetch

    // Poll every 10 seconds for new posts
    const interval = setInterval(() => {
      fetchPosts();
    }, 10000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Real-Time Feed
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://source.unsplash.com/random/400x200?sig=${post.id}`}
                  alt="Post"
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.body}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Feed;
