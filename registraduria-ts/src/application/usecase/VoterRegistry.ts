import { VoterRepositoryPort } from '../port/out/VoterRepositoryPort';
import { Voter } from '../../domain/model/Voter';

export interface VoterRegistrationResult {
  registrationId: string;
  status: 'REGISTERED' | 'ALREADY_REGISTERED';
}

export type VoterRegistrationError = 'INVALID' | 'UNDERAGE';

export class VoterRegistry {
  constructor(private readonly repo: VoterRepositoryPort) {}

  register(v: Voter): VoterRegistrationResult | VoterRegistrationError {
    if (!v.documentId || !v.fullName) return 'INVALID';
    if (v.age < 18) return 'UNDERAGE';

    const existing = this.repo.findByDocumentId(v.documentId);
    if (existing) {
      return { registrationId: existing.documentId, status: 'ALREADY_REGISTERED' };
    }

    this.repo.save(v);
    return { registrationId: v.documentId, status: 'REGISTERED' };
  }
}
