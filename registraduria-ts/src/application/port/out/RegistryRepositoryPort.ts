export interface RegistryRepositoryPort {
  existsById(id: number): boolean;
  save(id: number, name: string, age: number, isAlive: boolean): void;
  deleteAll(): void;
}
