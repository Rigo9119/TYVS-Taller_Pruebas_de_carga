import { Router, Request, Response } from 'express';
import { VoterRegistry } from '../../application/usecase/VoterRegistry';
import { Voter } from '../../domain/model/Voter';

export function createVoterRouter(voterRegistry: VoterRegistry): Router {
  const router = Router();

  router.post('/register', (req: Request, res: Response) => {
    const { documentId, fullName, age, gender, cityCode, address, phone, email } = req.body ?? {};
    const voter: Voter = {
      documentId: String(documentId ?? ''),
      fullName: String(fullName ?? ''),
      age: Number(age),
      gender: String(gender ?? ''),
      cityCode: String(cityCode ?? ''),
      address: String(address ?? ''),
      phone: String(phone ?? ''),
      email: String(email ?? ''),
    };

    const result = voterRegistry.register(voter);

    if (typeof result === 'string') {
      res.status(422).json({ error: result });
      return;
    }

    res.status(200).json(result);
  });

  return router;
}
