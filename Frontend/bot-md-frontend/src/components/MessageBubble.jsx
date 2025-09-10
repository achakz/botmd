import React from "react";
import { Box, Paper, Typography, Avatar, Stack } from "@mui/material";
import SmartToy from "@mui/icons-material/SmartToy";
import Person from "@mui/icons-material/Person";

const MessageBubble = ({ from, text }) => {
  const isUser = from === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-end"
        sx={{
          flexDirection: isUser ? "row-reverse" : "row",
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? "primary.main" : "grey.700",
            width: 36,
            height: 36,
          }}
        >
          {isUser ? <Person /> : <SmartToy />}
        </Avatar>
        <Paper
          elevation={3}
          sx={{
            p: "12px 16px",
            maxWidth: "clamp(200px, 70%, 800px)",
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "primary.contrastText" : "text.primary",
            borderRadius: isUser
              ? "20px 20px 5px 20px"
              : "20px 20px 20px 5px",
            wordWrap: "break-word",
          }}
        >
          <Typography variant="body1">{text}</Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default MessageBubble;