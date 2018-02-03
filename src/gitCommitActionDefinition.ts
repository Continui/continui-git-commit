import { ActionActivationDefinition, ActionActivationReference, Action } from 'continui-action';
import { GitCommitAction } from './gitCommitAction';

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
   * Represents the action activation references, also called dependency references.
   */
  public get activationReferences(): ActionActivationReference[] { return []; }
}
