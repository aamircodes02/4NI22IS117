import React from "react";
import { useTopUsers } from "../hooks/useTopUsers";
import {
  Container,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
} from "@mui/material";

const getRandomAvatar = () => `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`;

const TopUsers = () => {
  const { topUsers, loading } = useTopUsers();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Top 5 Most Engaged Users</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ padding: 2 }}>
          <List>
            {topUsers.map((user, index) => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar src={getRandomAvatar()} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${index + 1}. ${user.name}`}
                  secondary={`Total Comments on Posts: ${user.commentCount}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default TopUsers;
