import React, { useEffect, useState } from "react";
import {
  ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography,
  Button, Container, Card, CardContent, Divider, Chip, Stack,
  List, ListItem, ListItemText, LinearProgress, IconButton, CircularProgress
} from "@mui/material";
import { ArrowBack, VolumeUp } from "@mui/icons-material";
import { getUserHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { speak } from "../components/TTSPlayer";
import { useNavigate } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    primary: {
      main: '#2f81f7',
    },
    text: {
      primary: '#c9d1d9',
      secondary: '#8b949e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
        fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 500,
    }
  },
});

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserHistory(user.token);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar 
          position="static" 
          elevation={0}
          sx={{
            background: 'linear-gradient(90deg, #161b22 0%, #0d1117 100%)',
            borderBottom: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.12)',
          }}
        >
          <Toolbar>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/chat")}
            >
              Back to Chat
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
            Consultation History
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
              <CircularProgress />
            </Box>
          ) : history.length === 0 ? (
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" sx={{ color: 'text.secondary' }}>
                  No history available.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            history.map((item) => (
              <Card 
                key={item._id} 
                sx={{ 
                  mb: 3, 
                  border: '1px solid',
                  borderColor: 'rgba(255, 255, 255, 0.12)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(item.createdAt).toLocaleString()}
                    </Typography>
                    <IconButton
                      onClick={() => speak(item.humanized_response)}
                      color="primary"
                    >
                      <VolumeUp />
                    </IconButton>
                  </Stack>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 2 }}>
                    &ldquo;{item.message}&rdquo;
                  </Typography>

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>Symptoms</Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mb={2}>
                    {item.extracted_symptoms.map((symptom, i) => (
                      <Chip key={i} label={symptom} color="primary" variant="outlined" />
                    ))}
                  </Stack>

                  <Typography variant="h6" gutterBottom>Possible Diagnosis</Typography>
                  <List dense>
                    {item.structured_prediction.map((res, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemText 
                          primary={res.disease} 
                          primaryTypographyProps={{ fontWeight: 'bold' }}
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <LinearProgress
                                variant="determinate"
                                value={res.score * 100}
                                sx={{ width: '80%', mr: 1, height: 8, borderRadius: 5 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {`${(res.score * 100).toFixed(1)}%`}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>Summary</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {item.humanized_response}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default History;