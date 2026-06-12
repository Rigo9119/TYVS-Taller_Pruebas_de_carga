import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Registry } from '../../application/usecase/Registry';
import { RegistryRepositoryPort } from '../../application/port/out/RegistryRepositoryPort';
import { RegisterResult } from '../../domain/model/RegisterResult';
import { Gender } from '../../domain/model/Gender';
import { Person } from '../../domain/model/Person';

/**
 * Pruebas unitarias para Registry usando un mock del repositorio.
 *
 * Formato AAA:
 *   Arrange – prepara datos y comportamiento del mock
 *   Act     – ejecuta el método bajo prueba
 *   Assert  – verifica el resultado y las interacciones del mock
 *
 * Beneficio: prueba pura sin infraestructura real (sin BD, sin red).
 */
describe('Registry (unitaria con mock)', () => {
  let repo: RegistryRepositoryPort;
  let registry: Registry;

  beforeEach(() => {
    repo = {
      existsById: vi.fn(),
      save: vi.fn(),
      deleteAll: vi.fn(),
    };
    registry = new Registry(repo);
  });

  it('shouldReturnDuplicatedWhenRepoSaysExists', () => {
    // Arrange
    vi.mocked(repo.existsById).mockReturnValue(true);
    const p: Person = { name: 'Ana', id: 7, age: 25, gender: Gender.FEMALE, alive: true };

    // Act
    const result = registry.registerVoter(p);

    // Assert
    expect(result).toBe(RegisterResult.DUPLICATED);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('shouldCallSaveWhenPersonIsValid', () => {
    // Arrange
    vi.mocked(repo.existsById).mockReturnValue(false);
    const p: Person = { name: 'Luis', id: 10, age: 30, gender: Gender.MALE, alive: true };

    // Act
    const result = registry.registerVoter(p);

    // Assert
    expect(result).toBe(RegisterResult.VALID);
    expect(repo.save).toHaveBeenCalledOnce();
    expect(repo.save).toHaveBeenCalledWith(10, 'Luis', 30, true);
  });

  it('shouldReturnInvalidForNullPerson', () => {
    // Arrange / Act / Assert
    expect(registry.registerVoter(null)).toBe(RegisterResult.INVALID);
    expect(repo.existsById).not.toHaveBeenCalled();
  });

  it('shouldReturnInvalidForNonPositiveId', () => {
    // Arrange
    const p: Person = { name: 'Test', id: 0, age: 25, gender: Gender.MALE, alive: true };

    // Act / Assert
    expect(registry.registerVoter(p)).toBe(RegisterResult.INVALID);
    expect(repo.existsById).not.toHaveBeenCalled();
  });

  it('shouldReturnDeadForDeceasedPerson', () => {
    // Arrange
    const p: Person = { name: 'Difunto', id: 5, age: 40, gender: Gender.MALE, alive: false };

    // Act / Assert
    expect(registry.registerVoter(p)).toBe(RegisterResult.DEAD);
    expect(repo.existsById).not.toHaveBeenCalled();
  });

  it('shouldReturnUnderageForMinor', () => {
    // Arrange
    const p: Person = { name: 'Menor', id: 6, age: 17, gender: Gender.FEMALE, alive: true };

    // Act / Assert
    expect(registry.registerVoter(p)).toBe(RegisterResult.UNDERAGE);
    expect(repo.existsById).not.toHaveBeenCalled();
  });
});
