# Curadores Front

Una aplicación moderna de React para el sistema de gestión de curadores NMP-H17.

## Descripción

Este proyecto es una aplicación front-end construida con React y TypeScript que proporciona una interfaz de usuario para que los curadores gestionen y organicen contenido. Utiliza componentes de Material UI para un diseño consistente y responsive.

## Tecnologías

- React 19
- TypeScript
- Vite
- Material UI
- React Router
- Axios

## Comenzando

### Requisitos previos

- Node.js (v18 o superior recomendado)
- npm o yarn

### Instalación

1. Clonar el repositorio

   ```git
   git clone https://github.com/your-username/curadores-front.git
   cd curadores-front
   ```

2. Instalar dependencias

   ```git
   npm install
   ```

3. Iniciar el servidor de desarrollo
   ```git
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173/`

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Verifica el código
- `npm run preview` - Previsualiza la versión de producción localmente
- `npm run test` - Ejecuta las pruebas
- `npm run test:watch` - Ejecuta las pruebas en modo observador
- `npm run test:coverage` - Ejecuta las pruebas con reporte de cobertura

## Estructura del proyecto

```
curadores-front/
├── public/            # Archivos estáticos
├── src/
│   ├── assets/        # Imágenes, fuentes, etc.
│   ├── components/    # Componentes reutilizables
│   ├── context/       # Proveedores de contexto de React
│   ├── hooks/         # Hooks personalizados de React
│   ├── pages/         # Componentes de páginas
│   ├── routes/        # Configuración de rutas
│   ├── services/      # Servicios de API
│   ├── theme/         # Configuración del tema UI
│   ├── types/         # Definiciones de tipos de TypeScript
│   ├── App.tsx        # Componente principal de la aplicación
│   └── main.tsx       # Punto de entrada de la aplicación
├── data/              # Datos de prueba para desarrollo
├── backend/           # Archivos de integración con el backend
├── package.json       # Dependencias y scripts del proyecto
└── vite.config.ts     # Configuración de Vite
```

## Características

- React moderno con componentes funcionales y hooks
- Seguridad de tipos con TypeScript
- Material UI para un sistema de diseño consistente
- Diseño responsive para dispositivos de escritorio y móviles
- Configuración completa de pruebas con Vitest

## Buenas prácticas

- Arquitectura basada en componentes
- TypeScript para verificación de tipos
- ESLint para calidad de código
- Separación de responsabilidades con servicios, hooks y contextos

## Licencia

[Licencia MIT](LICENSE)

## Contacto

Para preguntas y soporte, por favor crea un issue en el repositorio.
