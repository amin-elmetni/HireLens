-- Migration script to remove likes and dislikes columns from comments table
-- Run this AFTER implementing the CommentLike table and ensuring it's working properly

-- Remove the likes and dislikes columns since we now use the comment_likes table
ALTER TABLE comments DROP COLUMN likes;
ALTER TABLE comments DROP COLUMN dislikes;
