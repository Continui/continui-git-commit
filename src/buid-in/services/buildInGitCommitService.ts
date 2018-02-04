import { CommitRequest } from '../../domain/models/commitRequest';
import { GitCommitService } from '../../domain/services/gitCommitService';
import { CommandExecutionService, CommandExecutionOptions } from 'continui-services';

const privateScope: WeakMap<BuildInGitCommitService, {
  commandExecutionService: CommandExecutionService,
}> = new WeakMap();

/**
 * Represents a service that perform commits on a git repository.
 */
export class BuildInGitCommitService implements GitCommitService {

  constructor(commandExecutionService: CommandExecutionService) {
    privateScope.set(this, {
      commandExecutionService,
    });
  }

    /**
     * Returns the commit identifier as a result of a git commit with the provided commit request.
     * @param commitRequest Reresents the request for the commit.
     */
  public async commit(commitRequest: CommitRequest): Promise<string> {

    if (!commitRequest.message) {
      throw new Error('Must provided a commit message.');
    }

    let commitCommand: string = `git commit -m "${commitRequest.message}"`;
    commitCommand += commitRequest.options.verbose ? ' -v' : '';

    const commandOptions: CommandExecutionOptions = commitRequest.options.directory ? {
      directory: commitRequest.options.directory,
    } : null;

    await privateScope.get(this)
                          .commandExecutionService
                          .executeCommand(commitCommand, commandOptions);

    return privateScope.get(this)
                           .commandExecutionService
                           .executeCommand('git log --format="%H" -n 1', commandOptions);
  }
}
