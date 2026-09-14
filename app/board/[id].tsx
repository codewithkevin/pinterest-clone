import { useLocalSearchParams } from 'expo-router';
import { BoardDetailScreen } from '@/screens/board-detail/ui/BoardDetailScreen';

export default function BoardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BoardDetailScreen boardId={id} />;
}
