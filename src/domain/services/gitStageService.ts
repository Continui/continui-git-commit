import { StageRequest } from '../models/stageRequest';

/**
 * Represents a service that allows stage files in a git reposity.
 */
export interface GitStageService {
    /**
     * Performs an staging with the provided stage request.
     * @param stageRequest Represents the request for the stage.
     */
  stage(stageRequest: StageRequest): Promise<void>;
}
