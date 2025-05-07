import React from "react";
import { Container, Typography, CircularProgress, Grid, Card, CardContent, Avatar } from "@mui/material";
import { useFeedData } from "../hooks/useFeedData";

const getRandomImage = () => `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/200/200`;

const Feed = () => {
  const { posts, userMap, loading } = useFeedData();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Real-time Feed</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {posts.map((post) => {
            const user = userMap.get(post.userId);
            return (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card>
                  <CardContent>
                    <Avatar alt={user?.name} src={getRandomImage()} sx={{ mb: 1 }} />
                    <Typography variant="h6">{user?.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(post.timestamp).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>{post.content}</Typography>
                    <img src={getRandomImage()} alt="post" width="100%" style={{ marginTop: "10px", borderRadius: "8px" }} />
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Feed;
