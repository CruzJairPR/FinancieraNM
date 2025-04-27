import { useState, useEffect } from "react";
import { Curador, curadoresService } from "../services/api";
import {
  Card,
  Container,
  Grid,
  Typography,
  Avatar,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { ElementType } from "react";

const Curadores = () => {
  const [curadores, setCuradores] = useState<Curador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCuradores = async () => {
      try {
        const data = await curadoresService.getAll();
        setCuradores(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching curadores:", err);
        setError(
          "Error al cargar los curadores. Por favor, intente de nuevo más tarde."
        );
        setLoading(false);
      }
    };

    fetchCuradores();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        textAlign="center"
        sx={{ mb: 4 }}
      >
        Equipo de Curadores
      </Typography>

      <Grid container spacing={3}>
        {curadores.map((curador) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={curador.id}
            component={"div" as ElementType}
          >
            <Card
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={2}
              >
                <Avatar
                  src={curador.avatar}
                  alt={curador.nombre}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  textAlign="center"
                >
                  {curador.nombre}
                </Typography>
                <Chip
                  label={curador.especialidad}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {curador.experiencia} años de experiencia
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle1" component="h3" gutterBottom>
                  Información de contacto:
                </Typography>
                <Typography variant="body2">Email: {curador.email}</Typography>
                <Typography variant="body2">
                  Teléfono: {curador.telefono}
                </Typography>
              </Box>

              <Box mt={2} mb={1}>
                <Typography variant="subtitle1" component="h3" gutterBottom>
                  Proyectos destacados:
                </Typography>
                <List dense>
                  {curador.proyectos.map((proyecto, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemText primary={proyecto} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Curadores;
