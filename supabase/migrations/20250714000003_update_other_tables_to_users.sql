-- Migration: Update other tables to reference users table

-- Update user_roles to reference users
ALTER TABLE user_roles
    ADD CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
 
-- (Add similar constraints for any other tables referencing vendors/customers) 