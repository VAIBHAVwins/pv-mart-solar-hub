-- Migration: Update references to unified users table and set up cascade delete

-- Update vendor_quotations to reference users
ALTER TABLE vendor_quotations
    ADD CONSTRAINT fk_vendor_user FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE;

-- Update customer_requirements to reference users
ALTER TABLE customer_requirements
    ADD CONSTRAINT fk_customer_user FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE;

-- (Add similar constraints for any other tables referencing vendors/customers) 