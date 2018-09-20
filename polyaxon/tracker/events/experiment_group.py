import tracker

from event_manager.events import experiment_group

tracker.subscribe(experiment_group.ExperimentGroupCreatedEvent)
tracker.subscribe(experiment_group.ExperimentGroupUpdatedEvent)
tracker.subscribe(experiment_group.ExperimentGroupDeletedEvent)
tracker.subscribe(experiment_group.ExperimentGroupViewedEvent)
tracker.subscribe(experiment_group.ExperimentGroupBookmarkedEvent)
tracker.subscribe(experiment_group.ExperimentGroupUnBookmarkedEvent)
tracker.subscribe(experiment_group.ExperimentGroupStoppedEvent)
tracker.subscribe(experiment_group.ExperimentGroupResumedEvent)
tracker.subscribe(experiment_group.ExperimentGroupDoneEvent)
tracker.subscribe(experiment_group.ExperimentGroupNewStatusEvent)
tracker.subscribe(experiment_group.ExperimentGroupExperimentsViewedEvent)
tracker.subscribe(experiment_group.ExperimentGroupStatusesViewedEvent)
tracker.subscribe(experiment_group.ExperimentGroupMetricsViewedEvent)
tracker.subscribe(experiment_group.ExperimentGroupIterationEvent)
tracker.subscribe(experiment_group.ExperimentGroupRandomEvent)
tracker.subscribe(experiment_group.ExperimentGroupGridEvent)
tracker.subscribe(experiment_group.ExperimentGroupHyperbandEvent)
tracker.subscribe(experiment_group.ExperimentGroupBOEvent)
tracker.subscribe(experiment_group.ExperimentGroupDeletedTriggeredEvent)
tracker.subscribe(experiment_group.ExperimentGroupStoppedTriggeredEvent)
tracker.subscribe(experiment_group.ExperimentGroupResumedTriggeredEvent)
