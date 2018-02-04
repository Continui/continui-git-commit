import { CommitOptions } from './commitOptions';

/**
 * Represents a request for perform commits on a git repository.
 */
export interface CommitRequest {
    /**
     * Represents the message of the commitd.
     */
  message:string;

    /**
     * Represents the options of the commit.
     */
  options: CommitOptions;
}
