/**
 * Represents the option of the stage.
 */
export interface StageOptions {
    /**
     * Represents a boolean value specifying if the staging wil be forced.
     */
  force: boolean;

    /**
     * Represents a boolean value specifying if the staging wil be verbose.
     */
  verbose: boolean;

    /**
     * Represents the path where the operation will be performed.
     */
  directory?: string;
}
