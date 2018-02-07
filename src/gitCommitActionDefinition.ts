import { ActionActivationDefinition, Action, ActionActivationContext } from 'continui-action';
import { GitCommitAction } from './gitCommitAction';
import {
  BuildInGitCommitReversionService,
} from './buid-in/services/buildInGitCommitReversionService';
import { BuildInGitCommitService } from './buid-in/services/buildInGitCommitService';
import { BuildInGitStageService } from './buid-in/services/buildInGitStageService';

/**
 * Represents a action activation definition for GitHub releases.
 */
export class GitCommitActionDefinition implements ActionActivationDefinition {
  /**
   * Represents the action identifier.
   */
  public get identifier(): string { return 'git-commit'; }

  /**
   * Represents the action funtion that will be available for continui for instantiation.
   */
  public get action(): Function { return GitCommitAction; }

  /**
    * Register the stp dependencies into the provided containerized kernel.
    * @param ActionActivationContext Reresents the activation context.
    */
  public registerDependencies(actionActivationContext: ActionActivationContext): void {
    actionActivationContext.containerizedKernel
                           .bind('gitCommitReversionService')
                           .to(BuildInGitCommitReversionService);

    actionActivationContext.containerizedKernel
                           .bind('gitCommitService')
                           .to(BuildInGitCommitService);

    actionActivationContext.containerizedKernel
                           .bind('gitStageService')
                           .to(BuildInGitStageService);

  }
}
