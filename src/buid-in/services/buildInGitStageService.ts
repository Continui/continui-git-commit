import { StageRequest } from '../../domain/models/stageRequest';
import { GitStageService } from '../../domain/services/gitStageService';
import { CommandExecutionService, CommandExecutionOptions } from 'continui-services';

const privateScope: WeakMap<BuildInGitStageService, {
  commandExecutionService: CommandExecutionService,
}> = new WeakMap();

/**
 * Represents a service that allows stage files in a git reposity.
 */
export class BuildInGitStageService implements GitStageService {

  constructor(commandExecutionService: CommandExecutionService) {
    privateScope.set(this, {
      commandExecutionService,
    });
  }

    /**
     * Performs an staging with the provided stage request.
     * @param stageRequest Represents the request for the stage.
     */
  public async stage(stageRequest: StageRequest): Promise<void> {
    if (!stageRequest.files.length) {
      throw new Error('Should provide at least one file to stage.');
    }

    let stageCommand: string = `git add "${stageRequest.files.join(' ')}"`;
    stageCommand += stageRequest.options.force ? ' -f' : '';
    stageCommand += stageRequest.options.verbose ? ' -v' : '';

    const commandOptions: CommandExecutionOptions =  stageRequest.options.directory ? {
      directory: stageRequest.options.directory,
    } : null;

    await privateScope.get(this)
                          .commandExecutionService
                          .executeCommand(stageCommand, commandOptions);
  }
}
