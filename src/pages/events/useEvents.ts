import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelEventRegistration, eventKeys, getMyEvents, registerForEvent } from "../../api/events";
import { retryUnlessClientError } from "../../api/mentorship";
import { useAuth } from "../../context/auth/useAuth";
import { toast } from "../../components/toast/toast";

export function useMyEvents() {
  const { user, isDemo, isLoading } = useAuth();
  return useQuery({ queryKey: eventKeys.mine(user?.id ?? "anonymous"), queryFn: getMyEvents, enabled: !!user && !isDemo && !isLoading, retry: (count, error: Error) => retryUnlessClientError(count, error) });
}
export function useEventAction(id: string) {
  const { user } = useAuth();
  const client = useQueryClient();
  const account = user?.id ?? "anonymous";
  return useMutation({
    mutationKey: ["event-member", account, "action", id],
    mutationFn: async (cancel: boolean) => {
      const response = await (cancel ? cancelEventRegistration(id) : registerForEvent(id));
      return { message: response.message };
    },
    onSuccess: response => toast.success(response.message),
    retry: false,
    gcTime: 0,
    // Never replace populated public detail with the mutation's ID-only chapters.
    onSettled: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: eventKeys.detail(id, account) }),
        client.invalidateQueries({ queryKey: eventKeys.mine(account) }),
        client.invalidateQueries({ queryKey: ["events", "list"] }),
      ]);
    },
  });
}
