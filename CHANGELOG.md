# Changelog - Welcome Popup Dialog

## [1.1.0] - 2026-04-02

### ✨ Nuevas Funcionalidades

#### Componente RecoveryComponent (nueva página)
- Nueva página en `/auth/recuperar-cuenta/:token` para restablecer contraseña
- Lee el token desde la URL mediante `ActivatedRoute`
- Formulario con campos `password` y `passwordConfirm` con validación de coincidencia
- Envía `{ token, password }` al endpoint `users/restore` via `UsersService.restoreAccount()`
- Redirige a `/auth/login` tras éxito

### 🔧 Cambios Técnicos

#### Renombrado: RecoveryComponent → RestoreComponent
- Carpeta `pages/recovery/` renombrada a `pages/restore/`
- Archivos renombrados a `restore.component.{ts,html,scss}`
- Clase `RecoveryComponent` renombrada a `RestoreComponent`
- Selector cambiado de `app-recovery` a `app-restore`

#### Fix: baseHref en producción
- Configurado `"baseHref": "/contribuyente/"` en la configuración `production` de `angular.json`
- Ruta del logo cambiada de `/logo.png` a `logo.png` (relativa) para respetar el base href

### 📝 Archivos Modificados

1. **src/app/features/auth/auth.routes.ts**
   - Import y ruta de `RestoreComponent` (ex `RecoveryComponent`)
   - Nueva ruta `recuperar-cuenta/:token` apuntando a `RecoveryComponent`

2. **src/app/features/auth/pages/restore/** *(renombrado desde recovery/)*
   - `restore.component.ts` — clase, selector y referencias actualizadas
   - `restore.component.html`
   - `restore.component.scss`

3. **src/app/features/auth/pages/recovery/** *(nuevo)*
   - `recovery.component.ts`
   - `recovery.component.html`
   - `recovery.component.scss`

4. **src/app/features/auth/pages/login/login.component.ts**
   - Ruta del logo corregida a relativa (`logo.png`)

5. **angular.json**
   - `baseHref: /contribuyente/` añadido a la configuración `production`

---

## [1.0.0] - 2026-02-01

### ✨ Nuevas Funcionalidades

#### Sistema de Avisos al Iniciar Sesión
- Implementado popup de bienvenida que se muestra automáticamente al iniciar sesión
- El popup se muestra solo una vez por sesión de usuario
- Sistema basado en `sessionStorage` para control de visualización

#### Botón de Avisos en Navbar
- Agregado botón con icono de megáfono en la barra de navegación
- Permite reabrir el popup de avisos en cualquier momento
- Ubicado entre el logo y el menú de usuario
- Incluye tooltip "Ver avisos importantes"
- Estilo naranja (`severity="warn"`) coherente con el tema del popup

### 🎨 Mejoras de UI/UX

#### Tamaño del Popup Optimizado
- **Ancho aumentado**: De 550px a 1200px máximo (↑ 118%)
- **Altura aumentada**: Ahora ocupa 90vh de la pantalla
- **Responsive**: Mantiene 90vw en dispositivos móviles

#### Visualización de Imágenes Mejorada
- Contenedor de imágenes optimizado para aprovechar todo el espacio
- Altura del contenedor: `calc(90vh - 120px)`
- Imágenes se muestran completas sin recortes usando `object-fit: contain`
- Padding reducido para maximizar área visible
- Bordes redondeados (8px) para mejor estética

#### Estilos del Diálogo
- Header con gradiente naranja (`#f97316` a `#ea580c`)
- Header más compacto: padding reducido a `0.75rem 1rem`
- Contenido sin padding para maximizar espacio
- Indicadores del carousel con mejor visibilidad
- Carousel ocupa el 100% del espacio disponible

### 🔧 Cambios Técnicos

#### Login Component
- Agregada flag `showWelcomePopup` en sessionStorage al hacer login exitoso
- Flag se establece en `'true'` después de autenticación exitosa

#### Declarations List Component
- Implementada interfaz `OnDestroy` para limpieza de recursos
- Método `mostrarPopupBienvenida()` verifica y elimina flag después de mostrar
- Limpieza automática del popup en `ngOnDestroy()`
- Sistema que garantiza visualización en cada nuevo inicio de sesión

#### Router Configuration
- Configurado `onSameUrlNavigation: 'reload'` en app.config.ts
- Permite recarga de componentes en navegación a misma URL
- Asegura que el popup se muestre correctamente después de logout/login

#### Navbar Component
**Imports agregados:**
- `ViewContainerRef` de Angular core
- `TooltipModule` de PrimeNG
- `WelcomePopupService` del proyecto

**Nuevos servicios inyectados:**
- `welcomePopupService`: Gestión del popup de avisos
- `viewContainerRef`: Contenedor para renderizar el popup

**Nuevo método:**
- `mostrarAvisos()`: Abre el popup de avisos mediante el servicio

#### Welcome Popup Service
- Servicio ya existente, ahora utilizado desde múltiples componentes
- Gestiona creación dinámica del componente de popup
- Previene duplicación de instancias
- Delay de 300ms para mejor UX

#### Session Service
- Método `logout()` limpia todo el sessionStorage
- Asegura que las flags se reseteen al cerrar sesión

### 📝 Archivos Modificados

1. **src/app/features/auth/pages/login/login.component.ts**
   - Establecimiento de flag `showWelcomePopup` al iniciar sesión

2. **src/app/features/declarations/pages/declarations-list/declarations-list.component.ts**
   - Implementación de OnDestroy
   - Lógica de verificación y limpieza de flag
   - Cleanup del popup al destruir componente

3. **src/app/app.config.ts**
   - Configuración de router con `onSameUrlNavigation: 'reload'`

4. **src/app/shared/dialogs/welcome-popup-dialog/welcome-popup-dialog.component.html**
   - Aumento de dimensiones del diálogo
   - Optimización del contenedor de imágenes

5. **src/app/shared/dialogs/welcome-popup-dialog/welcome-popup-dialog.component.scss**
   - Estilos optimizados para máxima visualización
   - Header compacto
   - Contenido sin padding
   - Carousel full-height

6. **src/app/shared/dialogs/welcome-popup-dialog/welcome-popup-dialog.component.ts**
   - Import de CommonModule
   - Propiedades y métodos para control del carousel (preparado para futuras mejoras)

7. **src/app/shared/components/navbar/navbar.component.html**
   - Nuevo botón de avisos con tooltip

8. **src/app/shared/components/navbar/navbar.component.ts**
   - Imports de ViewContainerRef y TooltipModule
   - Inyección de WelcomePopupService
   - Método mostrarAvisos()

### 🔄 Flujo de Funcionamiento

1. **Usuario hace login** → Se establece `showWelcomePopup: 'true'` en sessionStorage
2. **Redirección a declaraciones** → Componente se inicializa
3. **ngOnInit ejecuta** → Verifica flag, muestra popup, elimina flag
4. **Usuario navega** → Flag ya no existe, no se muestra popup
5. **Usuario hace logout** → sessionStorage.clear() limpia todo
6. **Nuevo login** → El ciclo se repite

**Alternativa manual:**
- Usuario puede hacer clic en el botón de avisos en navbar en cualquier momento
- Se abre el popup sin importar el estado de las flags

### 📊 Contenido Actual del Popup

1. **Anuncio 1**: Recordatorio de presentar declaración del mes de enero
   - Imagen: `comunicado-mural-dsa.jpg`

2. **Anuncio 2**: Actualización del valor UMA 2026
   - Imagen: `actualizacion-uma-2026.jpg`
   - Fecha efectiva: 1° Febrero 2026

### 🎯 Beneficios

- ✅ Usuarios informados automáticamente al iniciar sesión
- ✅ No intrusivo: solo se muestra una vez por sesión
- ✅ Accesible: botón disponible para consulta posterior
- ✅ Mejor visualización: imágenes más grandes y legibles
- ✅ UX mejorada: diseño limpio y profesional
- ✅ Mantenible: fácil agregar o modificar anuncios en el futuro

### 🐛 Correcciones

- Corregido valor de severity de "warning" a "warn" en navbar button
- Optimizado uso de ViewEncapsulation (revertido para evitar conflictos)
- Simplificado manejo de indicadores del carousel

---

**Desarrollado el**: 1 de febrero de 2026
**Versión Angular**: Standalone Components
**Versión PrimeNG**: Latest
