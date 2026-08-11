export function deriveTrainingBreakdown(trainingSessions) {
  if (!trainingSessions) return null;
  const completed = trainingSessions.completedUsers ?? 0;
  const assigned = trainingSessions.assignedUsers ?? 0;
  const notCompleted = Math.max(assigned - completed, 0);

  return [
    { name: 'Completed', value: completed },
    { name: 'Not Completed', value: notCompleted },
  ];
}

export function deriveELearningBreakdown(eLearning) {
  if (!eLearning) return null;
  const completed = eLearning.completedUsers ?? 0;
  const inProgress = eLearning.inProgressUsers ?? 0;
  const assigned = eLearning.assignedUsers ?? 0;
  const notStarted = Math.max(assigned - completed - inProgress, 0);

  return [
    { name: 'Completed', value: completed },
    { name: 'In Progress', value: inProgress },
    { name: 'Not Started', value: notStarted },
  ];
}
