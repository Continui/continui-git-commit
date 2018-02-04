import { GitCommitReversionService } from '../../domain/services/gitCommitReversionService';
import { CommandExecutionService } from 'continui-services';

const privateScope: WeakMap<BuildInGitCommitReversionService, {
  commandExecutionService: CommandExecutionService,
}> = new WeakMap();

/**
 * Represents a service that can revert git commits.
 */
export class BuildInGitCommitReversionService implements GitCommitReversionService {

  constructor(commandExecutionService: CommandExecutionService) {
    privateScope.set(this, {
      commandExecutionService,
    });
  }

    /**
     * Revert the git commit with the provided commit indentifier.
     * @param commitIentifier Represents the commit identifier.
     */
  public async revertCommit(commitIentifier: string): Promise<void> {
    await privateScope.get(this)
                          .commandExecutionService
                          .executeCommand(`git revert ${commitIentifier}`);
                           
  }
}
