import { describe, it, expect, beforeEach } from "vitest";
import { Registry } from "../../application/usecase/Registry";
import { RegistryRepository } from "../../infrastructure/persistence/RegistryRepository";
import { RegisterResult } from "../../domain/model/RegisterResult";
import { Gender } from "../../domain/model/Gender";
import { Person } from "../../domain/model/Person";

describe("Registry (integración – repositorio en memoria)", () => {
  let repo: RegistryRepository;
  let registry: Registry;

  beforeEach(() => {
    repo = new RegistryRepository();
    repo.deleteAll();
    registry = new Registry(repo);
  });

  it("shouldRegisterValidPerson", () => {
    const p: Person = {
      name: "Ana",
      id: 100,
      age: 30,
      gender: Gender.FEMALE,
      alive: true,
    };
    const result = registry.registerVoter(p);

    expect(result).toBe(RegisterResult.VALID);
    expect(repo.existsById(100)).toBe(true);
  });

  it("shouldPersistValidVoterAndRejectDuplicates", () => {
    const p1: Person = {
      name: "Ana",
      id: 100,
      age: 30,
      gender: Gender.FEMALE,
      alive: true,
    };
    const p2: Person = {
      name: "AnaDos",
      id: 100,
      age: 40,
      gender: Gender.FEMALE,
      alive: true,
    };

    const result1 = registry.registerVoter(p1);

    expect(result1).toBe(RegisterResult.VALID);
    expect(repo.existsById(100)).toBe(true);

    const result2 = registry.registerVoter(p2);

    expect(result2).toBe(RegisterResult.DUPLICATED);
  });

  it("shouldReturnDeadForDeceasedPerson", () => {
    const p: Person = {
      name: "Difunto",
      id: 99,
      age: 40,
      gender: Gender.MALE,
      alive: false,
    };

    expect(registry.registerVoter(p)).toBe(RegisterResult.DEAD);
    expect(repo.existsById(99)).toBe(false);
  });

  it("shouldReturnUnderageForMinor", () => {
    const p: Person = {
      name: "Menor",
      id: 50,
      age: 17,
      gender: Gender.FEMALE,
      alive: true,
    };

    expect(registry.registerVoter(p)).toBe(RegisterResult.UNDERAGE);
    expect(repo.existsById(50)).toBe(false);
  });

  it("shouldReturnInvalidForNegativeId", () => {
    const p: Person = {
      name: "Test",
      id: -1,
      age: 25,
      gender: Gender.MALE,
      alive: true,
    };

    expect(registry.registerVoter(p)).toBe(RegisterResult.INVALID);
  });

  it("shouldRegisterExactlyAtAge18", () => {
    const p: Person = {
      name: "Joven",
      id: 77,
      age: 18,
      gender: Gender.MALE,
      alive: true,
    };

    expect(registry.registerVoter(p)).toBe(RegisterResult.VALID);
  });
});
