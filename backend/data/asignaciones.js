const asignaciones = [
  {
    id: 1,
    fecha: "2024-03-15",
    nombre: "Campaña Navidad 2024",
    descripcion: "Selección de piezas para campaña navideña 2024",
    presupuesto: "100000",
    margen: "15",
    categorias: [
      {
        name: "joyeria_anillos",
        cantidad: "5",
        rangoMinimo: "5000",
        rangoMaximo: "15000",
      },
    ],
    estado: "sin_asignar",
  },
  {
    id: 2,
    fecha: "2024-02-20",
    nombre: "Promoción Día de las Madres",
    descripcion: "Selección de piezas para campaña del día de las madres",
    presupuesto: "80000",
    margen: "12",
    categorias: [
      {
        name: "joyeria_aretes",
        cantidad: "4",
        rangoMinimo: "3000",
        rangoMaximo: "10000",
      },
    ],
    estado: "en_progreso",
  },
];

module.exports = asignaciones;
