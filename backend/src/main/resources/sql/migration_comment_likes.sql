-- Migration script for comment likes/dislikes feature
-- This creates the comment_likes table to track individual user likes/dislikes

CREATE TABLE comment_likes (
    like_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_comment_likes_comment 
        FOREIGN KEY (comment_id) REFERENCES comments(comment_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_comment_likes_user 
        FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate likes from same user on same comment
    CONSTRAINT uk_comment_user_like UNIQUE (comment_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);
CREATE INDEX idx_comment_likes_comment_user ON comment_likes(comment_id, user_id);
