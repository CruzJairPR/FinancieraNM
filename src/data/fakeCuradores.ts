// src/data/fakeCuradores.ts
export interface Curador {
  id: number;
  nombre: string;
  codigo: string;
  email: string;
  asignaciones: string;
  disponible: boolean;
  avatar?: string;
}

// Fake data for curators
export const FAKE_CURADORES: Curador[] = [
  {
    id: 1,
    nombre: "Juan Martínez",
    codigo: "#34556",
    email: "juan.martinez@gmail.com",
    asignaciones: "1/3",
    disponible: true,
  },
  {
    id: 2,
    nombre: "Ana López",
    codigo: "#78932",
    email: "ana.lopez@hotmail.com",
    asignaciones: "2/3",
    disponible: true,
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    codigo: "#45677",
    email: "carlos.ruiz@gmail.com",
    asignaciones: "0/3",
    disponible: true,
  },
  {
    id: 4,
    nombre: "María García",
    codigo: "#12345",
    email: "maria.garcia@gmail.com",
    asignaciones: "3/3",
    disponible: false,
  },
];

export default FAKE_CURADORES;
