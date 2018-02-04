import { StageOptions } from './StageOptions';

/**
 * Represents a request for perform files staging on a git repository.
 */
export interface StageRequest {
    /**
     * Represents the files that will be staged.
     */
  files:string[];

    /**
     * Represents the options of the stagin.
     */
  options: StageOptions;
}
