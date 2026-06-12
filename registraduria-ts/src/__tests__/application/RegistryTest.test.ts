import { describe, it, expect, beforeEach } from 'vitest';
import { Registry } from '../../application/usecase/Registry';
import { RegistryRepository } from '../../infrastructure/persistence/RegistryRepository';
import { RegisterResult } from '../../domain/model/RegisterResult';
import { Gender } from '../../domain/model/Gender';
import { Person } from '../../domain/model/Person';

/**
 * Pruebas de integración para Registry con repositorio real (en memoria).
 *
 * Formato AAA:
 *   Arrange – crea instancias reales y prepara el estado inicial
 *   Act     – ejecuta el método bajo prueba
 *   Assert  – verifica el resultado y el estado del repositorio
 */
describe('Registry (integración – repositorio en memoria)', () => {
  let repo: RegistryRepository;
  let registry: Registry;

  beforeEach(() => {
    // Arrange: repositorio limpio antes de cada prueba
    repo = new RegistryRepository();
    repo.deleteAll();
    registry = new Registry(repo);
  });

  it('shouldRegisterValidPerson', () => {
    // Arrange
    const p: Person = { name: 'Ana', id: 100, age: 30, gender: Gender.FEMALE, alive: true };

    // Act
    const result = registry.registerVoter(p);

    // Assert
    expect(result).toBe(RegisterResult.VALID);
    expect(repo.existsById(100)).toBe(true);
  });

  it('shouldPersistValidVoterAndRejectDuplicates', () => {
    // Arrange
    const p1: Person = { name: 'Ana', id: 100, age: 30, gender: Gender.FEMALE, alive: true };
    const p2: Person = { name: 'AnaDos', id: 100, age: 40, gender: Gender.FEMALE, alive: true };

    // Act – primer registro
    const result1 = registry.registerVoter(p1);

    // Assert primer registro
    expect(result1).toBe(RegisterResult.VALID);
    expect(repo.existsById(100)).toBe(true);

    // Act – segundo registro con mismo ID
    const result2 = registry.registerVoter(p2);

    // Assert segundo registro
    expect(result2).toBe(RegisterResult.DUPLICATED);
  });

  it('shouldReturnDeadForDeceasedPerson', () => {
    // Arrange
    const p: Person = { name: 'Difunto', id: 99, age: 40, gender: Gender.MALE, alive: false };

    // Act / Assert
    expect(registry.registerVoter(p)).toBe(RegisterResult.DEAD);
    expect(repo.existsById(99)).toBe(false);
  });

  it('shouldReturnUnderageForMinor', () => {
    // Arrange
    const p: Person = { name: 'Menor', id: 50, age: 17, gender: Gender.FEMALE, alive: true };

    // Act / Assert
    expect(registry.registerVoter(p)).toBe(RegisterResult.UNDERAGE);
    expect(repo.existsById(50)).toBe(false);
  });

  it('shouldReturnInvalidForNegativeId', () => {
    // Arrange
    const p: Person = { name: 'Test', id: -1, age: 25, gender: Gender.MALE, alive: true };

    // Act / Assert
    expect(registry.registerVoter(p)).toBe(RegisterResult.INVALID);
  });

  it('shouldRegisterExactlyAtAge18', () => {
    // Arrange: límite de edad
    const p: Person = { name: 'Joven', id: 77, age: 18, gender: Gender.MALE, alive: true };

    // Act / Assert
    expect(registry.registerVoter(p)).toBe(RegisterResult.VALID);
  });
});
