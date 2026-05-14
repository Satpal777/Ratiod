export const SOCKET_EVENTS = {
  JOIN_POLL: "poll:join",
  LEAVE_POLL: "poll:leave",
  RESPONSE_COUNT: "poll:response-count",
  ANALYTICS_UPDATED: "poll:analytics",
} as const;

export function pollRoom(pollId: string) {
  return `poll:${pollId}`;
}
