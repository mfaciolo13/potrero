import { describe, expect, it } from "vitest";

import { ACCESS_STAGE, accessStage } from "./accessStage";

const ready = { policiesAccepted: true, role: "PLAYER", organizerRequestPending: false };

describe("accessStage", () => {
  it("manda al login si no hay sesión", () => {
    expect(accessStage(false, null)).toBe(ACCESS_STAGE.login);
  });

  it("ignora el perfil si no hay sesión", () => {
    expect(accessStage(false, ready)).toBe(ACCESS_STAGE.login);
  });

  it("pide aceptar las políticas si todavía no las aceptó", () => {
    expect(accessStage(true, { ...ready, policiesAccepted: false })).toBe(ACCESS_STAGE.policies);
  });

  it("deja entrar a la app si ya aceptó las políticas", () => {
    expect(accessStage(true, ready)).toBe(ACCESS_STAGE.app);
  });

  it("deja entrar a la app mientras no hay perfil cargado", () => {
    expect(accessStage(true, null)).toBe(ACCESS_STAGE.app);
  });

  it("muestra el error si falló la carga del perfil", () => {
    expect(accessStage(true, null, true)).toBe(ACCESS_STAGE.error);
  });

  it("no deja entrar a la app si falló la carga y no hay perfil", () => {
    expect(accessStage(true, null, true)).not.toBe(ACCESS_STAGE.app);
  });

  it("ignora el error de carga si ya hay perfil", () => {
    expect(accessStage(true, ready, true)).toBe(ACCESS_STAGE.app);
  });

  it("manda al login si no hay sesión aunque haya fallado el perfil", () => {
    expect(accessStage(false, null, true)).toBe(ACCESS_STAGE.login);
  });

  it("pide elegir el rol si ya aceptó las políticas y todavía no tiene uno", () => {
    expect(accessStage(true, { ...ready, role: null })).toBe(ACCESS_STAGE.role);
  });

  it("pide aceptar las políticas antes que elegir el rol", () => {
    expect(accessStage(true, { ...ready, role: null, policiesAccepted: false })).toBe(ACCESS_STAGE.policies);
  });

  it("deja entrar a la app a quien pidió ser organizador y espera la aprobación", () => {
    expect(accessStage(true, { ...ready, role: null, organizerRequestPending: true })).toBe(ACCESS_STAGE.app);
  });
});
