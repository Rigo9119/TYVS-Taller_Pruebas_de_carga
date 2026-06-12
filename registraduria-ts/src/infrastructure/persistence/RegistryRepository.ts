import { RegistryRepositoryPort } from '../../application/port/out/RegistryRepositoryPort';

interface RegistryRecord {
  id: number;
  name: string;
  age: number;
  isAlive: boolean;
}

export class RegistryRepository implements RegistryRepositoryPort {
  private readonly store = new Map<number, RegistryRecord>();

  existsById(id: number): boolean {
    return this.store.has(id);
  }

  save(id: number, name: string, age: number, isAlive: boolean): void {
    this.store.set(id, { id, name, age, isAlive });
  }

  deleteAll(): void {
    this.store.clear();
  }
}
