
import { Action, ActionOption, ActionOptionTypes, ActionOptionValueMap } from 'continui-action';
import { GitCommitActionContext } from './gitCommitActionContext';
import { TextTemplateService } from 'continui-services';

import { exec } from 'child_process';
import { error } from 'util';

const privateScope = new WeakMap<GitCommitAction, {
  textTemplateService: TextTemplateService,
}>();

/**
 * Represents a git action that can create commits in a git respository.
 */
export class GitCommitAction implements Action<GitCommitActionContext> {

  constructor(textTemplateService: any) {
    privateScope.set(this, {
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

    if (actionOptionValueMap.file && actionOptionValueMap.fileAll) {
      throw new Error('Can not stage all files when specific files are provided in file option.');
    }

    yield this.stageFiles(actionOptionValueMap);

    yield this.commitChanges(actionOptionValueMap, context);       
  }

    /**
     * Restore the action base on the given options and context.
     * @param context Represents the action execution context.
     */
  public * restore(actionOptionValueMap: ActionOptionValueMap,
                   context: GitCommitActionContext)
        : void | Promise<void> | IterableIterator<any> {

    const revertCommand: string = `git revert ${context.commitIdentifier}`;
    return this.executeCommand(revertCommand);
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

  private stageFiles(actionOptionValueMap: ActionOptionValueMap): Promise<void> {
    const files: string[] = actionOptionValueMap.fileAll ? 
                                    ['.'] :
                                    actionOptionValueMap.file instanceof Array ?
                                        actionOptionValueMap.file :
                                        [actionOptionValueMap.file];
        
    let stageCommand: string = `git add "${files.join(' ')}"`;
    stageCommand += actionOptionValueMap.fileForce ? ' -f' : '';
    stageCommand += actionOptionValueMap.fileVerbose ? ' -v' : '';

    return this.executeCommand(stageCommand);
  }

  private commitChanges(actionOptionValueMap: ActionOptionValueMap,
                        context: GitCommitActionContext): Promise<void> {

    let commitCommand: string = `git commit -m "${actionOptionValueMap.message}"`;
    commitCommand += actionOptionValueMap.verbose ? ' -v' : '';

    return this.executeCommand(commitCommand, output => context.commitIdentifier = output);
  }

  private executeCommand(command: string,
                         onSuccess: (output: string) => void = null): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      exec(command, (error: Error, stdout: string, strerr: string) => {
        if (error) {
          throw error;
        }

                // TODO: emit event about the output of the process.

        onSuccess(stdout);
        resolve();
      });
    });
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
    }];
  }
}
