# Manual de Usuario - Dashboard de Consulta de Pagos

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Pantalla Principal](#pantalla-principal)
4. [Consultar Pagos](#consultar-pagos)
5. [Búsqueda y Filtros](#búsqueda-y-filtros)
6. [Gestión de Estados](#gestión-de-estados)
7. [Navegación y Paginación](#navegación-y-paginación)
8. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Introducción

El Dashboard de Pagos Zazu es una plataforma web diseñada para consultar, filtrar y gestionar notificaciones de pago de manera eficiente. Este manual le guiará paso a paso sobre cómo utilizar todas las funcionalidades del sistema.

### ¿Qué puedo hacer con este dashboard?
- Consultar todas las notificaciones de pago recibidas
- Filtrar pagos por estado, monto, fecha, dispositivo y más
- Buscar pagos específicos por código o nombre
- Actualizar el estado de las notificaciones
- Navegar entre diferentes páginas de resultados

---

## Acceso al Sistema

### Iniciar Sesión

1. Abra su navegador web y diríjase a la URL del dashboard
2. Ingrese su correo electrónico y contraseña
3. Haga clic en el botón "Iniciar sesión"

**Nota:** Si es su primera vez, deberá registrarse primero utilizando la opción "Crear cuenta".

### Cerrar Sesión

Para cerrar sesión de manera segura:
1. Haga clic en el botón de usuario en la esquina superior derecha
2. Seleccione "Cerrar sesión"

---

## Pantalla Principal

Una vez que inicie sesión, verá el Dashboard principal con los siguientes elementos:

### Barra de Navegación Superior
- **Filtros rápidos por estado**: Botones para filtrar por Todas, Pendientes, Validadas y Rechazadas
- **Buscador**: Campo de búsqueda rápida
- **Filtros avanzados**: Botón para acceder a opciones de filtrado detallado
- **Usuario**: Botón para cerrar sesión

### Tabla de Notificaciones
La tabla muestra las siguientes columnas:
- **Código**: Código único de 3 dígitos del pago (ej: "123", "456")
- **Nombre**: Nombre del pagador
- **Dispositivo**: ID del dispositivo que registró el pago (ej: "TK-0111")
- **Monto**: Cantidad pagada
- **Estado**: Estado actual de la notificación (Pendiente/Validada/Rechazada)
- **Fecha**: Fecha y hora del pago
- **Acciones**: Menú para cambiar el estado de la notificación

### Paginación
En la parte inferior encontrará:
- Número de resultados mostrados
- Botones para navegar entre páginas
- Indicador de página actual

---

## Consultar Pagos

### Ver Todas las Notificaciones

Por defecto, al ingresar al dashboard verá todas las notificaciones ordenadas por fecha (las más recientes primero).

### Interpretación de Estados

Cada notificación tiene un estado identificado por un color:

- **Pendiente** (Gris/Amarillo): Pago recibido pero aún no validado
- **Validada** (Verde): Pago confirmado y aprobado
- **Rechazada** (Rojo): Pago rechazado o inválido

### Información Mostrada

Para cada pago podrá ver:
- **Código de seguridad**: Los códigos pueden ser:
  - Códigos de 3 dígitos (123, 456, etc.)
  - Código "000" para notificaciones Yape sin código de seguridad
- **Nombre del pagador**: Nombre completo de quien realizó el pago
- **Dispositivo**: Identificador del dispositivo que registró la transacción
- **Monto**: Cantidad pagada (en soles)
- **Fecha y hora**: Momento exacto en que se registró el pago

---

## Búsqueda y Filtros

### Búsqueda Rápida

El campo de búsqueda en la parte superior le permite buscar en tiempo real:

1. Haga clic en el campo "Buscar..."
2. Escriba cualquiera de los siguientes datos:
   - Código del pago
   - Nombre del pagador
   - ID del dispositivo
   - Monto

3. Los resultados se filtrarán automáticamente mientras escribe

**Ejemplo:** Si escribe "Juan", verá solo los pagos donde el nombre contenga "Juan"

### Filtros Rápidos por Estado

En la barra superior encontrará 4 botones de filtro rápido:

#### 1. Todas
- Muestra todas las notificaciones sin importar su estado
- El contador indica el número total de registros

#### 2. Pendientes
- Muestra solo las notificaciones pendientes de validación
- El contador muestra cuántas notificaciones están pendientes
- Útil para revisar pagos que requieren acción

#### 3. Validadas
- Muestra solo las notificaciones confirmadas y aprobadas
- El contador indica cuántos pagos han sido validados
- Útil para revisión de pagos procesados

#### 4. Rechazadas
- Muestra solo las notificaciones rechazadas
- El contador indica cuántos pagos han sido rechazados
- Útil para auditoría de pagos no válidos

**Cómo usar los filtros rápidos:**
1. Haga clic en el botón del estado deseado
2. La tabla se actualizará automáticamente
3. Para volver a ver todas, haga clic en "Todas"

### Filtros Avanzados

Para búsquedas más específicas, utilice los filtros avanzados:

1. Haga clic en el botón "Filtros" en la barra superior
2. Se abrirá un panel con las siguientes opciones:

#### Código
- Buscar por código exacto del pago
- **Ejemplo:** Ingrese "123" para encontrar pagos con ese código

#### ID de Dispositivo
- Filtrar por dispositivo específico
- **Ejemplo:** "TK-0111", "P5-A", "P6-B"

#### Rango de Montos
- **Monto mínimo**: Ingrese el valor mínimo del pago
- **Monto máximo**: Ingrese el valor máximo del pago
- **Ejemplo:** Mínimo: 50, Máximo: 200 (mostrará pagos entre S/ 50 y S/ 200)

#### Rango de Fechas
- **Desde**: Seleccione la fecha inicial
- **Hasta**: Seleccione la fecha final
- **Ejemplo:** Desde: 01/12/2024, Hasta: 31/12/2024 (mostrará pagos de diciembre)

#### Aplicar Filtros
1. Configure los filtros deseados
2. Haga clic en "Aplicar Filtros"
3. La tabla se actualizará con los resultados

#### Limpiar Filtros
- Haga clic en el botón "Limpiar filtros" (X) junto al botón de Filtros
- O haga clic en "Limpiar filtros" dentro del panel de filtros avanzados
- Todos los filtros se eliminarán y verá todas las notificaciones

### Combinar Filtros

Puede combinar diferentes tipos de filtros para búsquedas más precisas:

**Ejemplo 1:** Pagos pendientes del dispositivo TK-0111
1. Haga clic en "Pendientes"
2. Abra Filtros Avanzados
3. Ingrese "TK-0111" en ID de Dispositivo
4. Aplique los filtros

**Ejemplo 2:** Pagos validados entre S/ 100 y S/ 500 en diciembre
1. Haga clic en "Validadas"
2. Abra Filtros Avanzados
3. Monto mínimo: 100, Monto máximo: 500
4. Desde: 01/12/2024, Hasta: 31/12/2024
5. Aplique los filtros

---

## Gestión de Estados

### Actualizar el Estado de una Notificación

Puede cambiar el estado de cualquier notificación directamente desde la tabla:

#### Pasos para Actualizar Estado:

1. Localice la notificación que desea actualizar
2. En la columna "Acciones", haga clic en el botón de menú (⋮)
3. Seleccione el nuevo estado deseado:
   - **Validar**: Marca el pago como válido y confirmado
   - **Rechazar**: Marca el pago como rechazado
   - **Marcar como pendiente**: Regresa el pago al estado pendiente

4. El estado se actualizará automáticamente
5. Recibirá una notificación de confirmación en pantalla

#### Casos de Uso Comunes:

**Validar un Pago Pendiente:**
- Use esta opción cuando haya verificado que el pago es correcto
- El pago pasará de estado Pendiente a Validado

**Rechazar un Pago Incorrecto:**
- Use esta opción si el pago es inválido o incorrecto
- El pago pasará a estado Rechazado

**Corregir un Estado:**
- Si marcó un pago por error, puede cambiarlo de nuevo
- Por ejemplo, de Rechazado a Pendiente para revisarlo nuevamente

### Indicador de Actualización

Mientras se actualiza un estado:
- El botón de acciones mostrará un indicador de carga
- No podrá realizar cambios hasta que se complete la actualización
- Una vez completado, verá un mensaje de confirmación

---

## Navegación y Paginación

### Entender la Paginación

El dashboard muestra 50 notificaciones por página por defecto. Si hay más resultados disponibles, puede navegar entre páginas.

### Controles de Paginación

En la parte inferior de la tabla encontrará:

#### Información de Resultados
- **"Mostrando X de Y resultados"**: Indica cuántos registros está viendo del total

#### Botones de Navegación
- **Anterior**: Ir a la página anterior
- **Siguiente**: Ir a la página siguiente
- **Número de página**: Muestra la página actual

### Cómo Navegar

**Para ir a la página siguiente:**
1. Haga clic en el botón "Siguiente"
2. La tabla cargará los siguientes 50 resultados

**Para regresar a la página anterior:**
1. Haga clic en el botón "Anterior"
2. La tabla cargará los resultados previos

### Notas sobre Paginación

- Los filtros se mantienen al cambiar de página
- Si aplica un nuevo filtro, regresará automáticamente a la página 1
- El botón "Anterior" se deshabilitará en la primera página
- El botón "Siguiente" se deshabilitará cuando no haya más resultados

---

## Preguntas Frecuentes

### Consultas Generales

**¿Cuántas notificaciones puedo ver a la vez?**
Por defecto se muestran 50 notificaciones por página. Puede navegar entre páginas para ver más resultados.

**¿Se actualizan automáticamente las notificaciones?**
No. Debe recargar la página (F5) para ver nuevas notificaciones que hayan llegado después de cargar el dashboard.

**¿Qué significa el código "000"?**
El código "000" indica una notificación proveniente de Yape que no incluye código de seguridad.

### Búsqueda y Filtros

**¿La búsqueda distingue entre mayúsculas y minúsculas?**
No, la búsqueda no diferencia entre mayúsculas y minúsculas. "Juan" encontrará "JUAN", "juan", o "Juan".

**¿Puedo buscar por múltiples criterios?**
Sí, puede combinar la búsqueda rápida con filtros por estado y filtros avanzados para resultados más precisos.

**¿Cómo busco pagos de un día específico?**
Use los filtros avanzados y configure ambas fechas (Desde y Hasta) con la misma fecha.

**¿Puedo filtrar por rango de fechas y monto al mismo tiempo?**
Sí, todos los filtros avanzados pueden combinarse entre sí y con el filtro de estado.

### Gestión de Estados

**¿Puedo cambiar el estado de múltiples notificaciones a la vez?**
Actualmente no. Debe actualizar cada notificación individualmente.

**¿Se puede deshacer un cambio de estado?**
Sí, simplemente cambie el estado nuevamente al anterior usando el menú de acciones.

**¿Hay un registro de cambios de estado?**
El sistema actualiza el estado en tiempo real. Consulte con su administrador para acceso a logs históricos.

### Rendimiento y Datos

**¿Qué hago si la página carga lentamente?**
- Intente aplicar filtros para reducir la cantidad de resultados
- Verifique su conexión a internet
- Contacte al soporte técnico si el problema persiste

**¿Por qué veo duplicados?**
No debería ver duplicados. Si esto ocurre, contacte al soporte técnico.

**¿Hasta cuándo se guardan las notificaciones?**
Todas las notificaciones se mantienen en el sistema de forma permanente. Use los filtros de fecha para buscar notificaciones antiguas.

### Problemas Comunes

**No veo ninguna notificación:**
- Verifique que no tenga filtros activos
- Haga clic en "Todas" y "Limpiar filtros"
- Recargue la página (F5)

**El botón de filtros no funciona:**
- Asegúrese de hacer clic en "Aplicar Filtros" después de configurarlos
- Verifique que al menos un campo tenga un valor

**No puedo cambiar el estado de una notificación:**
- Espere a que se complete cualquier actualización en curso
- Recargue la página e intente nuevamente
- Verifique que su sesión no haya expirado

---

## Soporte Técnico

Si tiene problemas o preguntas que no están cubiertas en este manual:

1. Recargue la página (F5) para descartar problemas temporales
2. Cierre sesión y vuelva a iniciar sesión
3. Contacte a su administrador de sistema
4. Reporte el problema con la mayor cantidad de detalles posible:
   - ¿Qué estaba intentando hacer?
   - ¿Qué mensaje de error vio?
   - Captura de pantalla del problema

---

## Consejos y Mejores Prácticas

### Para Validación Diaria de Pagos

1. Inicie sesión al comienzo del día
2. Haga clic en "Pendientes" para ver solo los pagos sin validar
3. Revise cada pago cuidadosamente
4. Valide o rechace según corresponda
5. Al final del día, verifique que no queden pagos pendientes sin revisar

### Para Búsquedas Eficientes

1. Use la búsqueda rápida para consultas simples
2. Use filtros avanzados para búsquedas complejas
3. Combine filtros para resultados más precisos
4. Guarde los criterios de búsqueda frecuentes anotando los valores utilizados

### Para Auditoría de Pagos

1. Use el filtro de fechas para revisar períodos específicos
2. Filtre por "Validadas" o "Rechazadas" según lo que necesite auditar
3. Use el filtro de dispositivo para revisar pagos por punto de venta
