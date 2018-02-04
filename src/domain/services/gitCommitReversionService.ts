/**
 * Represents a service that can revert git commits.
 */
export interface GitCommitReversionService {
    /**
     * Revert the git commit with the provided commit indentifier.
     * @param commitIentifier Represents the commit identifier.
     */
  revertCommit(commitIentifier: string): Promise<void>;
}
