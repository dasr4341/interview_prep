export enum CollectionType {
  USER = 'users',
  LOCATION = 'locations',
  HEART = 'hearts',
  STEPS = 'steps',
  SLEEP = 'sleeps',
  SLEEP_RAW = 'sleep_raws',
  SPO2 = 'spo2s',
  HRV = 'hrvs',
  ECG = 'ecgs',
  RESTING_HEART_RATE = 'resting_heart_rates',
  RESPIRATORY_RATE = 'respiratory_rates',
  BASAL_ENERGY_BURNED = 'basal_energy_burneds',
  WALKING_HEART_RATE_AVERAGE = 'walking_heart_rate_averages',
  WALK_RUN_DUSTANCE = 'walk_run_distances',
  CYCLING_DISTANCE = 'cycling_distances',
  FLIGHTS_CLIMBED = 'flights_climbeds',
  APPLE_EXERCISE_TIME = 'apple_exercise_times',
  APPLE_STAND_TIME = 'apple_stand_times',
}

export enum HealthUnits {
  LOCATION = 'degree',
  HEART = 'bpm',
  STEPS = 'steps',
  SLEEP = 'minutes',
  SPO2 = '%',
  HRV = 'ms',
  ECG = 'volt',
  BASAL_ENERGY_BURNED = 'kilocalorie',
  RESTING_HEART_RATE = 'bpm',
  RESPIRATORY_RATE = '',
  WALKING_HEART_RATE_AVERAGE = 'minutes',
  WALK_RUN_DUSTANCE = '',
  CYCLING_DISTANCE = '',
  FLIGHTS_CLIMBED = '',
  APPLE_EXERCISE_TIME = 'minutes',
  APPLE_STAND_TIME = ''
}

export enum SleepLevels {
  inBed = 0,
  asleepUnspecified = 1,
  awake = 2,
  asleepCore = 3,
  asleepDeep = 4,
  asleepREM = 5,
}
