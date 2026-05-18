export type { Comment, CommentResponse, CreateCommentPayload } from './model/types';
export {
  createComment,
  getPostComments,
  getCommentById,
  getCommentReplies,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getCommentLikes,
} from './api/comments-api';
export { CommentItem } from './ui/comment-item';
