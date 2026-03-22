import { community } from '@/src/db/schema';

export type InsertCommunity = typeof community.$inferInsert;
export type SelectCommunity = typeof community.$inferSelect;

export type CommunityPermissions = {
  canEdit: boolean;
  canDelete: boolean;
  canJoin: boolean;
  canLeave: boolean;
  canViewMembers: boolean;
};

export type CommunityContext = {
  isMember: boolean;
  isAdmin: boolean;
};

export type CommunityWithPermissions = {
  data: SelectCommunity;
  context: CommunityContext;
  permissions: CommunityPermissions;
};
