import { RegistryRepositoryPort } from '../port/out/RegistryRepositoryPort';
import { Person } from '../../domain/model/Person';
import { RegisterResult } from '../../domain/model/RegisterResult';

export class Registry {
  constructor(private readonly repo: RegistryRepositoryPort) {}

  registerVoter(p: Person | null): RegisterResult {
    if (!p) return RegisterResult.INVALID;
    if (p.id <= 0) return RegisterResult.INVALID;
    if (!p.alive) return RegisterResult.DEAD;
    if (p.age < 18) return RegisterResult.UNDERAGE;

    if (this.repo.existsById(p.id)) return RegisterResult.DUPLICATED;
    this.repo.save(p.id, p.name, p.age, p.alive);
    return RegisterResult.VALID;
  }
}
