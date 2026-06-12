import { Router, Request, Response } from 'express';
import { Registry } from '../../application/usecase/Registry';
import { Person } from '../../domain/model/Person';
import { Gender } from '../../domain/model/Gender';

export function createRegistryRouter(registry: Registry): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response) => {
    const { name, id, age, gender, alive } = req.body ?? {};
    const person: Person = {
      name: String(name ?? ''),
      id: Number(id),
      age: Number(age),
      gender: (gender as Gender) ?? Gender.OTHER,
      alive: Boolean(alive),
    };
    const result = registry.registerVoter(person);
    res.type('text/plain').send(result);
  });

  return router;
}
