import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../api/keys';
import { mockTeamMembers } from '../data/mockTeamMembers';

function fetchTeamMembers() {
  return new Promise<typeof mockTeamMembers>((resolve) => {
    setTimeout(() => resolve(mockTeamMembers), 800);
  });
}

export function useTeamMembers() {
  const query = useQuery({
    queryKey: queryKeys.team.all,
    queryFn: fetchTeamMembers,
  });

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
}
