import { CommitRequest } from '../models/commitRequest';

/**
 * Represents a service that perform commits on a git repository.
 */
export interface GitCommitService {
    /**
     * Returns the commit identifier as a result of a git commit with the provided commit request.
     * @param commitRequest Reresents the request for the commit.
     */
  commit(commitRequest: CommitRequest): Promise<string>;
}
