import { VoterRepositoryPort } from '../../application/port/out/VoterRepositoryPort';
import { Voter } from '../../domain/model/Voter';

export class VoterRepository implements VoterRepositoryPort {
  private readonly store = new Map<string, Voter>();

  existsByDocumentId(documentId: string): boolean {
    return this.store.has(documentId);
  }

  findByDocumentId(documentId: string): Voter | undefined {
    return this.store.get(documentId);
  }

  save(voter: Voter): void {
    this.store.set(voter.documentId, voter);
  }

  deleteAll(): void {
    this.store.clear();
  }
}
