import React from "react";
import { useTrendingPosts } from "../hooks/useTrendingPosts";
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";

const getRandomImage = () =>
  `https://source.unsplash.com/random/400x200?sig=${Math.floor(Math.random() * 1000)}`;

const TrendingPosts = () => {
  const { trendingPosts, loading } = useTrendingPosts();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Trending Post{trendingPosts.length > 1 ? "s" : ""}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {trendingPosts.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={getRandomImage()}
                  alt="Post Image"
                />
                <CardContent>
                  <Typography variant="h6">{post.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    By {post.userName} | {post.commentCount} comment{post.commentCount > 1 ? "s" : ""}
                  </Typography>
                  <Typography variant="body1" mt={2}>
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

export default TrendingPosts;
