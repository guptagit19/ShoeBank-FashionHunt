-- Fallback: Create @ElementCollection tables if Hibernate DDL did not create them
-- These tables are used by Product entity's @ElementCollection for images and tags

CREATE TABLE IF NOT EXISTS product_images (
    product_id BIGINT NOT NULL,
    image_url VARCHAR(1024),
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS product_tags (
    product_id BIGINT NOT NULL,
    tag VARCHAR(255),
    CONSTRAINT fk_product_tags_product FOREIGN KEY (product_id) REFERENCES products(id)
);
