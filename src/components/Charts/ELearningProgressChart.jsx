import StatusPie from './StatusPie';

export default function ELearningProgressChart({ data }) {
  return <StatusPie title="E-Learning Progress" data={data} donut />;
}
