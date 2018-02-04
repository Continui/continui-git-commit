/**
 * Represents the option of the commit.
 */
export interface CommitOptions {
    /**
     * Represents a boolean value specifying if the commit wil be verbose.
     */
  verbose: boolean;

    /**
     * Represents the path where the operation will be performed.
     */
  directory?: string;
}
