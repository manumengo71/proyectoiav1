# 🎲 El Comparador de DMs (IA) - Edición Full-Stack

¡Bienvenido a la nueva era del Comparador de DMs! Esta ya no es solo una demo, sino una aplicación web Full-Stack completa diseñada para ofrecer una experiencia inmersiva y persistente en la comparación de DMs de IA.

Ahora, uno de los DMs está potenciado por **Google Gemini** y el otro por **OpenAI ChatGPT**, permitiendo una comparación directa entre los dos modelos de IA más avanzados.

Regístrate, guarda tus aventuras y continúa tus partidas cuando quieras. Todo con un nuevo diseño temático que te transportará a una taberna de fantasía.

## ✨ Características Principales

- **Comparación Directa Gemini vs. ChatGPT**: Una partida, dos narradores de IA de primer nivel.
- **Autenticación de Usuarios**: Crea tu propia cuenta para guardar tu progreso de forma segura.
- **Persistencia de Datos con MySQL**: Todas tus partidas y conversaciones se almacenan en una base de datos.
- **Sala de Aventuras**: Un panel personal donde puedes ver, continuar o borrar tus partidas guardadas.
- **Backend Seguro**: Un servidor Node.js (Express) gestiona la lógica, las llamadas a las APIs (manteniendo tus claves seguras) y la base de datos.
- **Diseño Inmersivo Totalmente Renovado**:
    - **Temática de Fantasía**: Fondos de madera y pergamino, tipografía medieval y colores cálidos.
    - **Componentes Estilizados**: Botones, formularios y ventanas de chat diseñados para una máxima inmersión.
    - **Lanzador de Dados Integrado**: Un panel de dados flotante para realizar tiradas (d4 a d20) directamente en la interfaz.

## 🛠️ Arquitectura y Tecnologías

- **Frontend**: React, TypeScript, Vite, Tailwind CSS.
- **Backend**: Node.js, Express.
- **Base de Datos**: MySQL (gestionado a través de XAMPP o manualmente).
- **APIs de IA**: Google Gemini API (`@google/genai`) y OpenAI API (`openai`).
- **Seguridad**: `bcryptjs` para el hash de contraseñas, `jsonwebtoken` para la gestión de sesiones.

## 🚀 Instalación y Puesta en Marcha

La instalación ahora consta de 3 partes: **Base de Datos**, **Backend** y **Frontend**.

---

### 1. Configuración de la Base de Datos (XAMPP - Método Recomendado)

(Esta sección no ha cambiado)

Usar XAMPP es la forma más sencilla de tener una base de datos MySQL funcionando.

1.  **Instalar y Ejecutar XAMPP**:
    -   Descarga e instala XAMPP desde el [sitio web oficial de Apache Friends](https://www.apachefriends.org/index.html).
    -   Abre el **Panel de Control de XAMPP**.
    -   Haz clic en **"Start"** para los módulos de **Apache** y **MySQL**. Deberían ponerse de color verde.

2.  **Crear la Base de Datos con phpMyAdmin**:
    -   Con Apache y MySQL en ejecución, abre tu navegador web y ve a `http://localhost/phpmyadmin/`.
    -   En el panel izquierdo, haz clic en **"Nueva"** para crear una nueva base de datos.
    -   **Nombre de la base de datos**: Escribe `dm_comparator`.
    -   **Cotejamiento**: Selecciona `utf8mb4_unicode_ci` en el menú desplegable.
    -   Haz clic en el botón **"Crear"**.

3.  **Importar la Estructura de las Tablas**:
    -   Una vez creada la base de datos, serás redirigido a su vista. Asegúrate de que `dm_comparator` está seleccionada en el panel izquierdo.
    -   Haz clic en la pestaña **"Importar"** en el menú superior.
    -   En la sección "Archivo a importar", haz clic en **"Seleccionar archivo"** y busca el archivo `sql/schema.sql` que se encuentra en la carpeta de este proyecto.
    -   Deja todas las demás opciones como están y haz clic en el botón **"Importar"** (o "Continuar") en la parte inferior de la página.
    -   Si todo va bien, verás un mensaje de éxito y las tablas `users`, `games`, y `messages` aparecerán en el panel izquierdo bajo la base de datos `dm_comparator`.

¡Listo! Tu base de datos está preparada.

---

### 2. Configuración del Backend (Servidor)

El servidor gestiona toda la lógica.

1.  **Abre una terminal**.
2.  **Navega a la carpeta del servidor**:
    ```bash
    cd server
    ```
3.  **Instala las dependencias**:
    ```bash
    npm install
    ```
4.  **Crea el archivo de entorno (`.env`)**:
    -   Crea un archivo llamado `.env` dentro de la carpeta `server`.
    -   Añade las siguientes variables. **Necesitarás claves para las APIs de Gemini y OpenAI**.
      ```env
      # Configuración para la Base de Datos con XAMPP
      DB_HOST=localhost
      DB_USER=root
      DB_PASSWORD=
      DB_NAME=dm_comparator

      # API de Google Gemini (reemplaza con tu clave)
      API_KEY=TU_API_KEY_DE_GEMINI

      # API de OpenAI (reemplaza con tu clave)
      OPENAI_API_KEY=TU_API_KEY_DE_OPENAI

      # JWT Secret (puedes poner cualquier cadena aleatoria y segura)
      JWT_SECRET=un_secreto_muy_largo_y_dificil_de_adivinar
      ```
      *Nota: Por defecto, el usuario `root` de XAMPP no tiene contraseña. Si has configurado una, ponla en `DB_PASSWORD`.*

5.  **Inicia el servidor**:
    ```bash
    npm start
    ```
    Si todo va bien, verás un mensaje como `Servidor escuchando en el puerto 3001`. **Deja esta terminal abierta ejecutando el servidor.**

---

### 3. Configuración del Frontend (Cliente)

Finalmente, inicia la interfaz de usuario.

1.  **Abre una NUEVA terminal**: No uses la que está ejecutando el servidor.
2.  **Navega a la raíz del proyecto** (la carpeta principal, no la carpeta `server`).
3.  **Instala las dependencias del frontend**:
    ```bash
    npm install
    ```
4.  **Inicia el servidor de desarrollo del frontend**:
    ```bash
    npm run dev
    ```

Vite iniciará el servidor de desarrollo y debería abrir automáticamente una pestaña en tu navegador en una dirección como `http://localhost:5173`. ¡Ahora deberías ver la pantalla de login y estar listo para registrarte y jugar!