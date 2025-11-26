# 🎲 El Comparador de DMs (IA) - Edición Full-Stack

**Creado por: Manuel C. Mendoza González**

¡Bienvenido a la nueva era del Comparador de DMs! Esta aplicación web Full-Stack está diseñada para ofrecer una experiencia inmersiva y persistente en la comparación de capacidades narrativas de Inteligencia Artificial.

En esta versión, el sistema pone a prueba la versatilidad de **Google Gemini** comparando dos configuraciones distintas del modelo: **Gemini 2.5 Flash (Modo Rápido)** vs **Gemini 2.5 Flash (Modo Pensamiento/Razonamiento)**, permitiendo observar cómo la capacidad de "Thinking" afecta la calidad de la narración y la coherencia en el rol.

Regístrate, guarda tus aventuras y continúa tus partidas cuando quieras. Todo con un diseño temático oscuro y profesional que te transportará a una mazmorra de fantasía.

## ✨ Características Principales

- **Comparación Gemini vs. Gemini**: Una partida, dos estilos de narración (Velocidad vs. Profundidad).
- **Autenticación de Usuarios**: Crea tu propia cuenta para guardar tu progreso de forma segura.
- **Persistencia de Datos con MySQL**: Todas tus partidas y conversaciones se almacenan en una base de datos.
- **Sala de Aventuras**: Un panel personal donde puedes ver, continuar o borrar tus partidas guardadas.
- **Backend Seguro**: Un servidor Node.js (Express) gestiona la lógica, las llamadas a las APIs y la base de datos.
- **Diseño Inmersivo "Dungeon Master"**:
    - **Temática Oscura**: Fondos de obsidiana, acentos rojo sangre y tipografía medieval.
    - **Componentes Estilizados**: Botones con efectos de brillo, inputs de alto contraste y cartas de aventura.
    - **Lanzador de Dados Integrado**: Un panel de dados flotante animado para realizar tiradas (d4 a d20).

## 🛠️ Arquitectura y Tecnologías

- **Frontend**: React, TypeScript, Vite, Tailwind CSS.
- **Backend**: Node.js, Express.
- **Base de Datos**: MySQL (gestionado a través de XAMPP o manualmente).
- **APIs de IA**: Google Gemini API (`@google/genai`).
- **Seguridad**: `bcryptjs` para el hash de contraseñas, `jsonwebtoken` para la gestión de sesiones.

## 🚀 Instalación y Puesta en Marcha

La instalación consta de 3 partes: **Base de Datos**, **Backend** y **Frontend**.

---

### 1. Configuración de la Base de Datos (XAMPP - Método Recomendado)

Usar XAMPP es la forma más sencilla de tener una base de datos MySQL funcionando.

1.  **Instalar y Ejecutar XAMPP**:
    -   Descarga e instala XAMPP.
    -   Inicia los módulos **Apache** y **MySQL**.

2.  **Crear la Base de Datos**:
    -   Ve a `http://localhost/phpmyadmin/`.
    -   Crea una base de datos llamada `dm_comparator`.
    -   Cotejamiento: `utf8mb4_unicode_ci`.

3.  **Importar Tablas**:
    -   Selecciona la base de datos `dm_comparator`.
    -   Ve a la pestaña **"Importar"**.
    -   Sube el archivo `sql/schema.sql` del proyecto y ejecuta.

---

### 2. Configuración del Backend (Servidor)

1.  **Abre una terminal** y ve a la carpeta del servidor:
    ```bash
    cd server
    ```
2.  **Instala las dependencias**:
    ```bash
    npm install
    ```
3.  **Configura el entorno (`.env`)**:
    -   Crea un archivo `.env` en la carpeta `server`:
      ```env
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=
      DB_NAME=dm_comparator
      API_KEY=TU_API_KEY_DE_GEMINI
      JWT_SECRET=tu_secreto_seguro
      ```

4.  **Inicia el servidor**:
    ```bash
    npm start
    ```

---

### 3. Configuración del Frontend (Cliente)

1.  **Abre otra terminal** en la raíz del proyecto.
2.  **Instala dependencias**:
    ```bash
    npm install
    ```
3.  **Inicia la aplicación**:
    ```bash
    npm run dev
    ```

Accede a `http://localhost:5173` para comenzar tu aventura.