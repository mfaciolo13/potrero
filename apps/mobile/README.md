# @potrero/mobile

App móvil para organizadores y equipos. Expo + expo-router, también corre en web.

## Cómo levantarla

Desde la raíz del repo:

```sh
npm install
npm run start --workspace @potrero/mobile      # Expo Go o build de desarrollo
npm run web --workspace @potrero/mobile        # en el navegador
```

## Build de desarrollo (EAS)

La app usa `expo-dev-client`, así que el login con Google y otras librerías nativas no corren en Expo Go: hace falta un build de desarrollo. El proyecto de EAS es `@mfaciolo/potrero` y los perfiles están en [eas.json](eas.json).

| Perfil | Plataforma | Resultado |
| --- | --- | --- |
| `development` | Android | APK instalable en el celular |
| `development` | iOS | Build para dispositivos registrados (requiere cuenta de Apple Developer) |
| `development-simulator` | iOS | Build para el simulador de iOS (no requiere cuenta de Apple, solo macOS para usarlo) |

Una sola vez, desde `apps/mobile`:

```sh
npx eas login
```

Generar el build (tarda unos minutos en la nube de EAS):

```sh
npx eas build --profile development --platform android
npx eas build --profile development --platform ios          # celular iOS
npx eas build --profile development-simulator --platform ios # simulador
```

Al terminar, EAS muestra un link y un QR. En Android se abre desde el celular y se instala el APK. En iOS, el celular tiene que estar registrado antes con `npx eas device:create`.

Con el build instalado, se levanta el servidor y la app se conecta sola:

```sh
npm run start --workspace @potrero/mobile -- --dev-client
```

El build solo se vuelve a generar cuando cambian dependencias nativas, plugins o `app.json`. El código JavaScript se actualiza con el servidor.

Los identificadores de la app (`com.potrero.mobile`) son los mismos en Android e iOS. Cambiarlos después obliga a registrar la app de nuevo en Google y Apple.

## Actualizaciones OTA (EAS Update)

Los cambios de JavaScript y de assets llegan a los celulares sin pasar por las tiendas, con EAS Update. Cada perfil de [eas.json](eas.json) tiene un canal con su mismo nombre (`development`, `preview`, `production`), y un build solo recibe las actualizaciones de su canal.

Para publicar una actualización, con `npx eas login` hecho:

```sh
npx eas update --channel preview --message "Descripción del cambio"
npx eas update --channel production --message "Descripción del cambio"
```

La app busca actualizaciones al abrirse, las descarga y las aplica en la apertura siguiente.

### Cuándo hace falta un build nuevo

Una actualización OTA solo sirve a los builds con el mismo `runtimeVersion`. Acá es la versión de la app (`version` en `app.json`, política `appVersion`), así que:

- **Cambio de JavaScript, estilos o imágenes:** alcanza con `eas update`.
- **Cambio nativo (nueva dependencia nativa, plugin, permisos o `app.json` nativo):** hay que subir `version` en `app.json` y generar un build nuevo. Los builds viejos dejan de recibir actualizaciones de esa versión, para que no reciban código que necesita librerías que no tienen.

Los builds generados antes de instalar `expo-updates` no reciben actualizaciones: hay que generarlos de nuevo.

## Versión web (EAS Hosting)

La web se publica en EAS Hosting, el mismo servicio de Expo donde están los builds. Como `app.json` usa `"output": "server"`, hace falta un hosting con servidor, y EAS Hosting lo da sin configuración extra.

- **URL de producción:** https://potrero.expo.app
- **Panel:** https://expo.dev/projects/f0cb5c40-9a06-4389-9b40-85c62085d73c/hosting/deployments

Para publicar una versión nueva, desde la raíz del repo y con `npx eas login` hecho:

```sh
npm run deploy:web --workspace @potrero/mobile
```

Eso exporta la web y la promueve a producción. Cada deploy queda además con su propia URL de previsualización, que se ve en el panel.

### Variables de entorno

La web apunta a la API con `EXPO_PUBLIC_API_URL`. Esa variable se incrusta al exportar, así que hay que cargarla en EAS antes de publicar:

```sh
npx eas env:create --environment production --name EXPO_PUBLIC_API_URL --value https://TU-API.up.railway.app --visibility plaintext
```

En local se define en `apps/mobile/.env` (hay un [.env.example](.env.example)).

### CORS

La API solo acepta llamadas de los orígenes de `CORS_ORIGINS`. Después de publicar hay que agregar `https://potrero.expo.app` a esa variable en Railway, separada por coma de las otras.

### Páginas públicas para las tiendas

Se ven sin iniciar sesión. El contenido sale de `lib/legal/` y es una copia de `docs/politica-de-privacidad.md`: si cambia el documento, hay que actualizar también el archivo de `lib/legal/`.

| Página | URL | Dónde cargarla |
| --- | --- | --- |
| Política de privacidad | https://potrero.expo.app/privacidad | Google Play (política de privacidad) y App Store Connect (URL de privacidad) |
| Eliminar la cuenta | https://potrero.expo.app/eliminar-cuenta | Google Play (URL para solicitar el borrado de cuenta, sección Seguridad de los datos) |

## Design system y tema

Los tokens y componentes base viven en [theme/](theme/) y [ui/](ui/). La fuente de verdad es la página **Tokens** del [Figma](https://www.figma.com/design/rHZdibYb6E9orNdce1Y2Qm/POTRERO?node-id=1-99). La pantalla [app/showcase.tsx](app/showcase.tsx) muestra todos los tokens y componentes y sirve para compararlos con el Figma. Solo existe en desarrollo: la ruta está protegida con `__DEV__` en el layout raíz y el botón de Inicio que la abre no se renderiza en otros builds.

El tema es propio: solo `StyleSheet.create` y hooks, sin librerías de estilos. Soporta esquema claro y oscuro siguiendo el del sistema.

### Tokens (`theme/tokens.ts`)

| Export | Qué es |
| --- | --- |
| `colorTokens` | Cada color del Figma con su valor `light` y `dark`. `colors.light` y `colors.dark` son las paletas ya armadas. |
| `spacing` | `s1` 4, `s2` 8, `s3` 12, `s4` 16, `s5` 20, `s6` 24, `s8` 32, `s14` 56. Más `touch` 44 (alto mínimo tocable), `tabBottom` 22 y `webContainer` 1160. |
| `radius` | `sm` 9, `md` 12, `field` 14, `lg` 16, `xl` 20, `pill` 999. |
| `stroke` | `hair` 1, `field` 1.5, `icon` 2, `iconSm` 2.2. |
| `typography` | Estilos de texto con familia, tamaño e interlineado. `display*` usan Barlow Condensed; el resto Inter. |
| `shadow.raise` | Sombra de la tarjeta destacada. |

Los nombres de color son los del Figma (`bg`, `card`, `ink`, `mute`, `pitch`, `lime`, `green`, `okFg`/`okBg`, `badFg`/`badBg`, etc.). `tokens.ts` no importa react-native, así que se testea en Node.

### Fuentes

Se cargan con `expo-font` desde `@expo-google-fonts/barlow-condensed` e `@expo-google-fonts/inter` (solo los pesos que usa el tema: Barlow Condensed 700 y 800, Inter 400 y 700). El layout raíz ([app/_layout.tsx](app/_layout.tsx)) llama a `useThemeFonts()` y mantiene el splash hasta que estén cargadas. No hace falta hacer nada más para usarlas: `typography` ya apunta a los nombres registrados.

### Usar el tema en un componente

```tsx
import { makeStyles, useTheme } from "@/theme";
import { Card, Text } from "@/ui";

const useStyles = makeStyles((t) => ({
  row: { flexDirection: "row", gap: t.spacing.s2, padding: t.spacing.s4 },
  badge: { backgroundColor: t.colors.okBg, borderRadius: t.radius.pill },
}));

export function Ejemplo() {
  const t = useTheme();          // tema actual: colors, spacing, radius, stroke, typography, shadow, scheme
  const styles = useStyles();    // StyleSheet.create con el tema, cacheado por esquema

  return (
    <Card style={styles.row}>
      <Text variant="title">Los Pibes</Text>
      <Text variant="secondary" color="mute" style={{ color: t.colors.okFg }}>
        Pagado
      </Text>
    </Card>
  );
}
```

- `useTheme()` devuelve el tema del esquema actual. Usarlo para valores puntuales en línea.
- `makeStyles(fn)` recibe el tema y devuelve un hook de estilos. Llama a `StyleSheet.create` una vez por esquema. Es la forma preferida para estilos estáticos.
- `ThemeProvider` ya está en el layout raíz. Acepta `scheme="light" | "dark"` para forzar un esquema en una subárbol (la pantalla showcase lo usa para el toggle).

### Componentes base (`ui/`)

| Componente | Para qué | Props principales |
| --- | --- | --- |
| `Text` | Todo texto de la app. | `variant` (clave de `typography`, por defecto `body`), `color` (clave de color, por defecto `ink`), `align`, `uppercase`. |
| `Button` | Acciones. Siete variantes del Figma. | `label`, `variant` (`primary`, `lime`, `outline`, `soft`, `danger`, `ghost`, `glass`), `size` (`sm`, `md`, `lg`), `loading`, `disabled`, `fullWidth`, `onPress`. |
| `Card` | Bloques de contenido. | `variant` (`default`, `raised`, `debt`, `active`, `dark`, `placeholder`), `padding` (clave de `spacing` o `none`). |
| `Chip` | Etiquetas de estado y rol. | `label`, `tone` (`ok`, `warn`, `bad`, `info`, `neutral`, `lime`, `glass`). |
| `Field` | Campos de texto con etiqueta, ayuda y error. | `label`, `hint`, `error`, `prefix` (por ejemplo `"$"`), `multiline`, `maxLength` (muestra contador si es multilínea) y todas las props de `TextInput`. |
| `Screen` | Contenedor de pantalla: fondo, área segura, scroll y ancho máximo en web. | `scroll` (por defecto `true`), `edges`, `contentStyle`. |

`glass` y `lime` (en `Button` y `Chip`) están pensados para ir sobre fondo `pitch`, por ejemplo dentro de `<Card variant="dark">`.

### Agregar o cambiar un token

1. Cambiarlo primero en el Figma.
2. Actualizar `theme/tokens.ts` con el mismo nombre.
3. Revisar la pantalla showcase y correr `npm run test --workspace @potrero/mobile`.

## Lint, tipos y tests

```sh
npm run lint --workspace @potrero/mobile
npm run typecheck --workspace @potrero/mobile
npm run test --workspace @potrero/mobile
```

Las rutas tipadas de expo-router se generan en `.expo/types` al correr `expo start`. Si `typecheck` falla por una ruta nueva, levantá la app una vez para regenerarlas.
