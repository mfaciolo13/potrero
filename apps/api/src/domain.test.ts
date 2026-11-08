import { buildFixture } from "@potrero/domain";
import { describe, expect, it } from "vitest";

describe("dominio compartido", () => {
  it("la API puede armar un fixture con @potrero/domain", () => {
    const registrations = ["a", "b", "c", "d"].map((teamId) => ({
      teamId,
      status: "ACTIVE" as const,
      verifiedPlayers: 5,
      charges: [],
    }));

    const fixture = buildFixture({ registrations, format: "F5", legs: 1, startDate: "2026-11-09" });

    expect(fixture.matchdays).toHaveLength(3);
  });
});
