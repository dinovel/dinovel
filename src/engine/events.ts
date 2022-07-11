export interface DinovelEvents {
  /** Called when dinovel has started */
  started: void;
  /**
   * Called to stop dinovel engine
   *
   * A message can be passed to the stop method to inform the user about the reason for stopping.
   */
  stop: string;

  /** Called for script or styles reload */
  reload: 'script' | 'style';
}
