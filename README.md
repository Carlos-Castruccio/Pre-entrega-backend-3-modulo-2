# ShipNow — Pre-entrega Módulo 2 Backend 3

## Mocking y carga de datos de prueba

Esta entrega extiende la API del módulo 1 con usuarios, repartidores, pedidos y entregas simulados. Conserva el CRUD de usuarios y productos y su arquitectura por capas.

### Preparar y ejecutar

```sh
npm ci
```

Copiá `.env.example` a `.env` y completá, por ejemplo:

```dotenv
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow_modulo2_test
NODE_ENV=development
```

Luego ejecutá `npm start` o `npm run dev`. El arranque normal requiere MongoDB porque conserva la conexión del módulo 1. La generación de mocks no consulta ni escribe la base.

### Endpoints de mocking

| Método | URL | Resultado |
| --- | --- | --- |
| GET | `/api/mocks/users?qty=2` | Array de usuarios con roles válidos, sin contraseña |
| GET | `/api/mocks/drivers?qty=2` | Array de usuarios con rol de repartidor |
| GET | `/api/mocks/orders?qty=2` | Objeto con `users` (clientes) y `orders` vinculados |
| GET | `/api/mocks/deliveries?qty=2` | Lote con `users`, `orders` y `deliveries` vinculados |
| GET | `/api/mocks/lote?qty=2` | Lote completo vinculado |
| POST | `/api/mocks/seed?qty=10` | Inserta 10 usuarios en MongoDB |
| POST | `/api/mocks/seed?qty=2&collection=all` | Inserta 4 usuarios, 2 pedidos y 2 entregas |

`qty` es un entero entre 1 y 100; por defecto vale 10. `collection` acepta `users` (por defecto) o `all`, solo en seed. Parámetros desconocidos, cantidades inválidas o repetidas y colecciones inválidas devuelven 400. Seed se usa sin body. Cada solicitud genera nuevos IDs y emails; repetir seed agrega otro lote.

Los GET devuelven JSON directo. En `users` y `drivers`, `qty` indica cantidad de usuarios. En `orders`, `deliveries`, `lote` y seed con `collection=all`, indica cantidad de pedidos y entregas; se generan además `qty` clientes y `qty` repartidores. Para observar relaciones usá una sola respuesta de `lote`: distintas solicitudes GET producen entidades independientes y sus IDs no existen en MongoDB.

### Probar con curl o Postman

```sh
curl "http://localhost:8080/api/mocks/users?qty=2"
curl "http://localhost:8080/api/mocks/drivers?qty=2"
curl "http://localhost:8080/api/mocks/orders?qty=2"
curl "http://localhost:8080/api/mocks/deliveries?qty=2"
curl "http://localhost:8080/api/mocks/lote?qty=2"
curl -X POST "http://localhost:8080/api/mocks/seed?qty=10"
curl -X POST "http://localhost:8080/api/mocks/seed?qty=2&collection=all"
curl "http://localhost:8080/api/users"
```

En PowerShell, usá `curl.exe` si `curl` apunta a otro comando. En Postman seleccioná GET o POST y pegá la URL; seed no necesita cuerpo.

Seed devuelve HTTP 201. El ejemplo de usuarios responde exactamente:

```json
{ "insertados": 10, "coleccion": "usuarios" }
```

Para `collection=all` devuelve `insertados`, el desglose `colecciones` y `datos` con los registros vinculados, sin contraseñas. Se pueden inspeccionar las colecciones `users`, `orders` y `deliveries` en MongoDB Compass; los usuarios también están disponibles en `/api/users`.

### Modelos y relaciones

Se mantienen `firstName`, `lastName`, `email`, `password` y `role` del modelo User. `USER_ROLES.USER` representa al cliente; se agrega `USER_ROLES.DELIVERY_DRIVER` para repartidores y se conserva `ADMIN`. El alta pública sigue asignando `USER`.

El módulo 1 no incluía pedidos, entregas ni sus constantes. Se incorporan `Order` y `Delivery` y se centralizan `ORDER_STATUS`, `ORDER_PRIORITY` y `DELIVERY_STATUS` en `src/constants/index.js`. Los repartidores reutilizan el modelo User, con su rol específico.

Cada pedido referencia a un cliente. Cada entrega referencia a un pedido único; si el pedido está en tránsito o entregado, referencia además a un repartidor. Los pedidos pendientes y cancelados tienen entregas pendientes y canceladas respectivamente, sin repartidor asignado. Los estados y prioridades se obtienen de las constantes, sin duplicar sus valores en los generadores.

El router declara rutas; el controller recibe parámetros y responde; el service genera y relaciona datos, limita cantidades y prepara contraseñas; el repository valida los esquemas y escribe en MongoDB; los modelos definen estructura e índices. Las contraseñas de seed son aleatorias y se guardan con el hash scrypt existente.

### Carga controlada

Usá una base de prueba. El endpoint de seed no tiene autenticación, igual que el CRUD heredado; esta API es un ejercicio local. La carga no borra datos previos y limita cada solicitud a 100 usuarios o 100 pedidos con sus entidades relacionadas (400 registros totales).

Antes de escribir se validan todos los documentos. La inserción sigue el orden usuarios → pedidos → entregas. Si una escritura falla, se intenta eliminar únicamente los IDs del lote, en orden inverso. Esta compensación permite usar MongoDB standalone, pero no es una transacción atómica: si se pierde la conexión o se interrumpe el proceso durante la carga, pueden quedar registros parciales que deben revisarse en la base de prueba.

## API heredada del módulo 1

API de usuarios y productos hecha con Node.js, Express y MongoDB. El objetivo de esta práctica es separar las responsabilidades en Controller, Service y Repository, y validar la configuración antes de iniciar el servidor.

## Cómo ejecutar

Se necesita Node.js 20.19 o superior y MongoDB local o una conexión de Atlas.

1. Abrí una terminal en la carpeta del proyecto.
2. Instalá las dependencias con `npm install`.
3. Copiá `.env.example` a `.env`. 
4. Completá las tres variables. Para trabajar con una base local nueva:

```dotenv
PORT=
MONGODB_URI=
NODE_ENV=
```

5. Asegurate de que MongoDB esté iniciado. Si usás Atlas, colocá tu URI y habilitá la conexión desde tu IP.
6. Ejecutá `npm run dev` para desarrollo o `npm start`.
7. Consultá `http://localhost:8080/health` si usaste `PORT=8080`; si elegiste otro puerto, ajustá la URL.

El archivo `.env.example` tiene las claves vacías para completar. `.env` y `node_modules` están excluidos por `.gitignore`.&#x20;

Si falta `PORT`, `MONGODB_URI` o `NODE_ENV`, el programa muestra qué variable falta y termina. También valida el rango del puerto, el entorno y el prefijo de la URI. Si MongoDB no está disponible, no se abre el servidor HTTP.

## Estructura

```text
src/
  config/          Lectura y validación de variables de entorno
  constants/       Roles y estados con Object.freeze
  controllers/     Reciben req y responden con res
  services/        Validaciones y reglas de negocio
  repositories/    Consultas y conexión a MongoDB
  models/          Esquemas de Mongoose
  routes/          Rutas conectadas con los controllers
  middlewares/     Respuesta común para errores
  utils/           Error personalizado y hash de contraseñas
  app.js           Configuración de Express
  server.js        Conexión y arranque
```

El recorrido de una solicitud es **Router → Controller → Service → Repository → MongoDB**. Hay un archivo separado para usuarios y otro para productos en cada capa. Se usan funciones; no hay clases base, controladores genéricos ni inyección de dependencias.

### Qué hace cada capa

El **Controller** recibe el ID, el body o el filtro de la solicitud. Llama al Service y devuelve JSON con el código HTTP correspondiente. No importa modelos ni Mongoose. Cada función usa `try/catch`: si ocurre un error, el catch llama a `next(error)` para que el middleware de errores devuelva la respuesta correspondiente.

El **Service** decide si los datos son válidos. Por ejemplo, el stock debe ser un entero no negativo y el estado del producto se calcula a partir de ese stock. Cuando vale cero, el estado es `OUT_OF_STOCK`; cuando es mayor que cero, es `AVAILABLE`. Esa decisión pertenece al negocio, por eso no está en el Repository.

El **Repository** decide cómo consultar y guardar: aplica filtros, ordena los resultados, selecciona los campos que devuelve y usa los validadores del esquema al actualizar. En usuarios excluye la contraseña incluso al crear. No decide roles ni calcula estados. Esto evita que sea solo un pasamanos de `find()`.

Los modelos únicamente declaran esquemas e índices. La conexión está en `repositories/database.js` para mantener los detalles de MongoDB junto al acceso a datos. Dentro de `src/`, `process.env` solo se lee en `config/env.config.js`.

La consigna menciona dos ubicaciones para configuración y constantes. Se implementan en `config/env.config.js` y `constants/index.js`; `config/index.js` y `utils/constants.js` permiten importarlas desde las otras ubicaciones sin duplicarlas.

### Usuarios y contraseñas

Los usuarios tienen los campos `firstName`, `lastName`, `email` y `password`. El email se guarda en minúsculas y tiene un índice único. La contraseña se transforma en un hash con `scrypt`, una función incluida en Node.js, y una sal aleatoria. Esta tarea está aislada en `utils/password.js` para que el Service sea fácil de seguir.

Los roles están definidos como `USER_ROLES.USER`, `USER_ROLES.ADMIN` y `USER_ROLES.DELIVERY_DRIVER`. El alta asigna `USER`; el body no admite cambiar el rol. Esta práctica no incorpora login ni permisos sobre el CRUD, así que está pensada para ejecutarse localmente como ejercicio.

## Endpoints

| Método | Productos            | Usuarios          | Resultado                  |
| ------ | -------------------- | ----------------- | -------------------------- |
| GET    | `/api/products`      | `/api/users`      | Listar                     |
| GET    | `/api/products/:pid` | `/api/users/:uid` | Buscar por ID              |
| POST   | `/api/products`      | `/api/users`      | Crear                      |
| PUT    | `/api/products/:pid` | `/api/users/:uid` | Actualizar campos enviados |
| DELETE | `/api/products/:pid` | `/api/users/:uid` | Eliminar                   |

Las listas devuelven todos los registros, sin paginación para mantener el alcance del módulo. Productos admite el filtro opcional `?status=AVAILABLE` o `?status=OUT_OF_STOCK`. Sin filtro se devuelven ambos estados.

PUT permite actualizar solamente los campos enviados. DELETE elimina definitivamente el registro. Los campos desconocidos, los cuerpos vacíos y los IDs inválidos generan un error 400.

## Ejemplos de solicitudes

Para POST y PUT, enviá un cuerpo JSON con el encabezado `Content-Type: application/json`. Los ejemplos usan el puerto 8080; si configurás otro `PORT`, reemplazalo en las URLs.

### Crear un producto

POST `http://localhost:8080/api/products`

```json
{
  "name": "Caja de envío",
  "description": "Caja mediana",
  "price": 1500,
  "stock": 10
}
```

Se devuelve 201 con el producto y su `_id`. Copiá ese ID para las siguientes consultas. No envíes `status`: se calcula en el Service.

PUT `http://localhost:8080/api/products/ID_DEL_PRODUCTO`

```json
{
  "stock": 0
}
```

El estado cambia a `OUT_OF_STOCK`. Podés comprobarlo con GET `/api/products?status=OUT_OF_STOCK`.

### Crear un usuario

POST `http://localhost:8080/api/users`

```json
{
  "firstName": "Ana",
  "lastName": "Pérez",
  "email": "ana@example.com",
  "password": "ejemplo123"
}
```

Se devuelve 201 y el rol `USER`, sin la contraseña. Repetir el email devuelve 409. La contraseña debe tener entre 8 y 128 caracteres.

### Respuestas

Las respuestas correctas del CRUD tienen la forma `{"status":"success","payload":...}`. Un error tiene `{"status":"error","message":"..."}`.

| Código | Uso                                            |
| ------ | ---------------------------------------------- |
| 200    | Consulta, actualización o eliminación correcta |
| 201    | Registro creado                                |
| 400    | Campos, ID o JSON inválidos                    |
| 404    | Registro o ruta inexistente                    |
| 409    | Email repetido                                 |
| 413    | Cuerpo de la solicitud demasiado grande        |
| 500    | Error interno                                  |



