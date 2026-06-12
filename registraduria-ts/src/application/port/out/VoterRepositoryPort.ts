import { Voter } from '../../../domain/model/Voter';

export interface VoterRepositoryPort {
  existsByDocumentId(documentId: string): boolean;
  findByDocumentId(documentId: string): Voter | undefined;
  save(voter: Voter): void;
  deleteAll(): void;
}
