import express from 'express';
import { Registry } from './application/usecase/Registry';
import { VoterRegistry } from './application/usecase/VoterRegistry';
import { RegistryRepository } from './infrastructure/persistence/RegistryRepository';
import { VoterRepository } from './infrastructure/persistence/VoterRepository';
import { createRegistryRouter } from './delivery/rest/registryRoutes';
import { createVoterRouter } from './delivery/rest/voterRoutes';

export function createApp(): express.Application {
  const app = express();
  app.use(express.json());

  const registryRepo = new RegistryRepository();
  const registry = new Registry(registryRepo);

  const voterRepo = new VoterRepository();
  const voterRegistry = new VoterRegistry(voterRepo);

  app.use('/register', createRegistryRouter(registry));
  app.use('/api/v1/voters', createVoterRouter(voterRegistry));

  return app;
}
