
import {
  Action,
  ActionOption,
  ActionOptionTypes,
  ActionOptionValueMap,
  ContinuiActionEvents,
} from 'continui-action';
import { GitCommitActionContext } from './gitCommitActionContext';
import { TextTemplateService, CommandExecutionService } from 'continui-services';
import { exec } from 'child_process';
import { GitStageService } from './domain/services/gitStageService';
import { GitCommitService } from './domain/services/gitCommitService';
import { GitCommitReversionService } from './domain/services/gitCommitReversionService';
import { StageRequest } from './domain/models/stageRequest';
import { CommitRequest } from './domain/models/commitRequest';

const privateScope = new WeakMap<GitCommitAction, {
  gitStageService: GitStageService,
  gitCommitService: GitCommitService,
  gitCommitReversionService: GitCommitReversionService,
  textTemplateService: TextTemplateService,
}>();

/**
 * Represents a git action that can create commits in a git respository.
 */
export class GitCommitAction extends Action<GitCommitActionContext> {

  constructor(gitStageService: GitStageService,
              gitCommitService: GitCommitService,
              gitCommitReversionService: GitCommitReversionService,
              textTemplateService: TextTemplateService) {
    super();

    privateScope.set(this, {
      gitStageService,
      gitCommitService,
      gitCommitReversionService,
      textTemplateService,
    });
  }

    /**
     * Get the action identifier.
     */
  public get identifier(): string { return 'git-commit'; }

    /**
     * Get the action name.
     */
  public get name(): string { return 'Git Commit'; }

    /**
     * Get the action description.
     */
  public get description(): string {
    return 'Represents a git action that can create commits in a git respository.';
  }

    /**
     * Represents the action otions used to execute the action.
     */
  public get options(): ActionOption[] { return this.getOptions(); }

    /**
     * Creates a restoration point based on the action to rollback the changes if the pipe
     * flow breaks.
     * @param actionOptionsValueMap Represents the options values provided to run the action.
     * @param context Represents the action execution context.
     */
  public createsRestaurationPoint(actionOptionValueMap: ActionOptionValueMap,
                                  context: GitCommitActionContext)
        : void | Promise<void> | IterableIterator<any> {
        // NOTHING to do here.
  }

    /**
     * Execute the action base on the given options and context.
     * @param actionOptionsValueMap Represents the options values provided to run the action.
     * @param context Represents the action execution context.
     */
  public * execute(actionOptionValueMap: ActionOptionValueMap,
                   context: GitCommitActionContext)
        : void | Promise<void> | IterableIterator<any> {

    const scope = privateScope.get(this);

    yield scope.gitStageService
               .stage(this.getStageRequestFromActionOptions(actionOptionValueMap));

    context.commitIdentifier =
      yield scope.gitCommitService
                 .commit(this.getCommitRequestFromActionOptions(actionOptionValueMap));     
  }

    /**
     * Restore the action base on the given options and context.
     * @param context Represents the action execution context.
     */
  public * restore(actionOptionValueMap: ActionOptionValueMap,
                   context: GitCommitActionContext)
        : void | Promise<void> | IterableIterator<any> {

    return privateScope.get(this)
                       .gitCommitReversionService
                       .revertCommit(context.commitIdentifier);
  }

    /**
     * Creates and return an new context bases on the provided options.
     * @param actionOptionsValueMap Represents the options values provided to run the action.
     * @returns A new execution context bases on the provided options.
     */
  public createsContextFromOptionsMap(actionOptionsValueMap: ActionOptionValueMap)
        : GitCommitActionContext {
    return {};
  }

  /**
   * Return a stage request based on the provided action options values.
   * @param actionOptionValueMap Represents the provided action options values.
   * @returns A stage request.
   */
  private getStageRequestFromActionOptions(actionOptionValueMap: ActionOptionValueMap):
    StageRequest {

    let files: string[];

    if (actionOptionValueMap.fileAll) {
      files = ['.'];
    } else {      
      files = actionOptionValueMap.file instanceof Array ?
                   actionOptionValueMap.file :
                   actionOptionValueMap.file ?
                      [actionOptionValueMap.file] :
                      [];
    }

    return {
      files,
      options: {
        force: !!actionOptionValueMap.fileForce,
        verbose: !!actionOptionValueMap.fileVerbose,
        directory: actionOptionValueMap.directory,
      },
    };    
  }

  /**
   * Return a commit request based on the provided action options values.
   * @param actionOptionValueMap Represents the provided action options values.
   * @returns A commit request.
   */
  private getCommitRequestFromActionOptions(actionOptionValueMap: ActionOptionValueMap): 
    CommitRequest {
    return {
      message: actionOptionValueMap.message,
      options: {
        verbose: !!actionOptionValueMap.verbose,
        directory: actionOptionValueMap.directory,
      },
    };
  }

  /**
   * Emmit an event with the provided information.
   * @param information Represents the information that will be emmited.
   */
  private emitInformation(information: string) {
    this.emit(ContinuiActionEvents.INFORMATION_AVAILABLE, information);
  }

    /**
     * Returns the action options.
     * @returns The action options.
     */
  private getOptions(): ActionOption[] {

    return [{
      key: 'message',
      description: 'Represents the message of the commit',
      isRequired: true,
      type: ActionOptionTypes.text,
    },
    {
      key: 'verbose',
      description: 'Represents a boolean value specifying if the commit will be verbose',
      type: ActionOptionTypes.boolean,
    },
    {
      key: 'file',
      description: 'Represents the file(s) that will be commited',
      type: ActionOptionTypes.list,
      defaultValue: 'api.github.com',
    },
    {
      key: 'file-all',
      description: 'Represents a boolean value specifying if all modified and deleted files ' +
                         'will be commited',
      type: ActionOptionTypes.boolean,
    },
    {
      key: 'file-force',
      description: 'Represents a boolean value specifying if the files staging will be forced',
      type: ActionOptionTypes.boolean,
    },
    {
      key: 'file-verbose',
      description: 'Represents a boolean value specifying if the files staging will be verbose',
      type: ActionOptionTypes.boolean,
    },
    {
      key: 'directory',
      description: 'Represents the path where the operation will be performed.',
      type: ActionOptionTypes.text,
    }];
  }
}
