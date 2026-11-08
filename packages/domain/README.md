# @potrero/domain

Reglas de negocio de los torneos como funciones puras, sin base de datos ni red. La usan la API y la app, así que una regla se escribe una sola vez.

Los nombres siguen el [modelo de datos](../../docs/modelo-de-datos.md): los estados son los mismos valores de los enums de Prisma (`PENDING`, `OVERDUE`, `WALKOVER`...). Los números de regla (RN-xx) son los del informe.

## Qué incluye

| Módulo | Funciones | Reglas |
| --- | --- | --- |
| `fixture` | `roundRobin`, `buildFixture`, `isTeamReady`, `MIN_PLAYERS` | RN-01, RN-13, RN-14 |
| `standings` | `standings` | RN-10, RN-11, RN-12 |
| `payments` | `closeMatchday`, `mustLoseByWalkover`, `unpaidStreak`, `shouldBeRemoved`, `cancelPendingMatches`, `isEnabled`, `debtOf` | RN-03 a RN-08 |
| `dates` | `addDays`, `isMonday`, `nextMonday` | RN-14 |

- **Fixture.** Todos contra todos, a una o dos vueltas. Solo entran los equipos activos con el plantel mínimo de jugadores verificados (5 en F5, 7 en F7). Una fecha por semana, siempre desde un lunes. Con cantidad impar de equipos, uno queda libre por fecha.
- **Tabla.** Puntos, diferencia de gol, goles a favor, fair play (amarilla 1, roja 3, menos es mejor) y nombre. El walkover da los goles configurados al ganador y, sin ganador, los dos pierden.
- **Pagos.** Al cerrar una fecha sin cuota pagada, la cuota queda vencida y se suma la multa. Con una fecha anterior vencida, el equipo solo puede perder por walkover. Dos fechas seguidas vencidas dan de baja y cancelan los partidos pendientes. Saldar la deuda vuelve a habilitar al equipo.

## Cómo se usa

```ts
import { buildFixture, standings } from "@potrero/domain";
```

El paquete se compila a `dist/` con `npm run build --workspace @potrero/domain`. Eso corre solo después de `npm install`, y la API lo vuelve a correr en su build.

## Qué cambió respecto al prototipo

El código viene de `pelota-parada-ai/app/src/domain`, con estos cambios para alinearlo con el informe y el modelo de datos:

- **Nombres en inglés** y estados con los valores de los enums de la base.
- **Sin inscripción por jugador.** El prototipo exigía que cada jugador pagara su inscripción. El informe dice que la inscripción es gratis (RN-01) y que el plantel mínimo se cuenta con jugadores verificados.
- **Sin canchas ni horarios.** El prototipo asignaba cada partido a un horario de una cancha. El modelo de datos no tiene canchas: el partido solo guarda `scheduled_at`. `buildFixture` devuelve los cruces por fecha y la fecha de cada semana, y el horario se carga aparte.
- **Un equipo impago sí juega** la fecha en la que debe (RN-03), en vez de quedar inhabilitado. El walkover se aplica recién cuando hay una fecha anterior vencida (RN-04).
- **Las reglas de pago son funciones sobre cargos** (`Charge`), igual que la tabla `charges`, y no sobre un mapa de estados por fecha.
