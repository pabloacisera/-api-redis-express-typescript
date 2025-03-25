# Redis Caching API

Este repositorio contiene una API construida con Node.js, Express.js y TypeScript, diseñada para mejorar el rendimiento de la obtención de datos desde una API externa mediante el uso de Redis como sistema de caché.

## Tecnologías Utilizadas

Las siguientes tecnologías han sido utilizadas en el desarrollo de esta API:

* **Node.js:** Entorno de ejecución para JavaScript en el servidor.
* **Express.js:** Framework de aplicaciones web minimalista y flexible para Node.js.
* **TypeScript:** Superset de JavaScript que añade tipado estático opcional.
* **Redis:** Almacén de estructura de datos en memoria, utilizado como caché para mejorar la velocidad de acceso a los datos.
* **Axios:** Cliente HTTP basado en promesas para realizar peticiones a la API externa.
* **morgan:** Middleware de registro de solicitudes HTTP para Node.js.
* **response-time:** Middleware de Express.js para registrar el tiempo de respuesta de las solicitudes.
* **express-list-endpoints:** Utilidad para listar todos los endpoints definidos en una aplicación de Express.js.
* **dotenv:** Módulo para cargar variables de entorno desde un archivo `.env`.

## Utilidad de la API

La API expone un único endpoint:

* **/get\_fake\_data**: Este endpoint tiene como objetivo obtener datos de la API externa ubicada en `https://retoolapi.dev/0EOPV6/data`. Su funcionamiento es el siguiente:

    1.  **Verificación de la caché:** Al recibir una solicitud, la API primero consulta si los datos ya están almacenados en la caché de Redis bajo la clave `'fake_data'`.
    2.  **Servicio desde la caché:** Si los datos se encuentran en la caché, se devuelven inmediatamente al cliente, lo que reduce la latencia y la carga en la API externa.
    3.  **Obtención desde la API externa:** Si los datos no están en la caché, la API realiza una petición GET a la dirección `https://retoolapi.dev/0EOPV6/data` utilizando Axios.
    4.  **Almacenamiento en caché:** Una vez que se reciben los datos de la API externa, se almacenan en la caché de Redis con un tiempo de expiración de 3600 segundos (1 hora). Esto asegura que las próximas solicitudes puedan ser atendidas desde la caché hasta que los datos se consideren obsoletos.
    5.  **Respuesta al cliente:** Finalmente, los datos obtenidos (ya sea desde la caché o desde la API externa) se envían como respuesta al cliente que realizó la solicitud.

En resumen, esta API actúa como una capa de caché inteligente para la API externa, mejorando la eficiencia y la velocidad de acceso a los datos.

## Estado del Desarrollo

El proyecto se encuentra en una etapa funcional, implementando la lógica principal de caché para los datos obtenidos de la API externa. Las siguientes características están actualmente implementadas:

* Conexión a Redis para el almacenamiento en caché.
* Endpoint `/get_fake_data` para obtener y servir datos, utilizando la caché de Redis.
* Registro de solicitudes HTTP mediante `morgan` para facilitar el seguimiento y la depuración.
* Medición del tiempo de respuesta de las solicitudes utilizando `response-time`.
* Listado de todos los endpoints disponibles al iniciar el servidor.
* Manejo adecuado del cierre del servidor y la desconexión de Redis al recibir señales `SIGTERM` y `SIGINT`.
* Registro detallado de las peticiones y respuestas HTTP realizadas con Axios, incluyendo interceptores para mostrar información útil en la consola.
* Estrategia de reconexión para el cliente de Redis en caso de pérdida de conexión.

Actualmente, la API proporciona una forma eficiente de acceder a los datos de la API externa mediante el uso de una estrategia de caché simple basada en un tiempo de expiración fijo. Posibles futuras mejoras podrían incluir la implementación de estrategias de invalidación de caché más sofisticadas o la adición de más endpoints para interactuar con diferentes recursos de la API externa.