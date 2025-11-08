import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
    name = 'InitialSchema1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "name" varchar NOT NULL,
            "email" varchar UNIQUE NOT NULL,
            "password_hash" varchar NOT NULL,
            "created_at" timestamptz NOT NULL DEFAULT now()
        )`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "workspaces" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "owner_id" uuid NOT NULL,
            "name" varchar NOT NULL,
            "logo_url" text,
            "primary_color" varchar(20),
            "tone_of_voice" varchar(20) NOT NULL DEFAULT 'casual',
            "emoji_style" boolean NOT NULL DEFAULT true,
            "language" varchar(10) NOT NULL DEFAULT 'pt-PT',
            "created_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT fk_workspaces_owner FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE
        )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON "workspaces"("owner_id")`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "instagram_accounts" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "workspace_id" uuid NOT NULL,
            "instagram_business_id" varchar NOT NULL,
            "page_name" varchar NOT NULL,
            "access_token_encrypted" text NOT NULL,
            "is_active" boolean NOT NULL DEFAULT true,
            "created_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT fk_instagram_workspace FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
        )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_ig_workspace ON "instagram_accounts"("workspace_id")`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "products" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "workspace_id" uuid NOT NULL,
            "title" varchar NOT NULL,
            "brand" varchar NOT NULL,
            "model" varchar NOT NULL,
            "year" int NOT NULL,
            "mileage_km" int NOT NULL,
            "price" numeric(12,2) NOT NULL,
            "fuel_type" varchar NOT NULL,
            "gearbox" varchar NOT NULL,
            "highlights" jsonb NOT NULL DEFAULT '[]'::jsonb,
            "status" varchar(20) NOT NULL DEFAULT 'active',
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT fk_products_workspace FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
        )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_products_workspace ON "products"("workspace_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_products_status ON "products"("status")`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "product_images" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "product_id" uuid NOT NULL,
            "image_url" text NOT NULL,
            "is_cover" boolean NOT NULL DEFAULT false,
            "created_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT fk_product_images_product FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
        )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_product_images_product ON "product_images"("product_id")`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "workspace_settings" (
            "workspace_id" uuid PRIMARY KEY,
            "stories_per_day" int NOT NULL DEFAULT 4,
            "time_slots" jsonb NOT NULL DEFAULT '["10:00","14:00","18:00","21:00"]'::jsonb,
            "auto_post_enabled" boolean NOT NULL DEFAULT false,
            "max_repetition_days" int NOT NULL DEFAULT 3,
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT fk_workspace_settings_workspace FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
        )`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "story_batches" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "workspace_id" uuid NOT NULL,
            "date" date NOT NULL,
            "status" varchar(20) NOT NULL DEFAULT 'generated',
            "created_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT fk_story_batches_workspace FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
            CONSTRAINT uq_story_batches_workspace_date UNIQUE ("workspace_id","date")
        )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_story_batches_workspace_date ON "story_batches"("workspace_id","date")`);

        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "stories" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "batch_id" uuid NOT NULL,
            "workspace_id" uuid NOT NULL,
            "product_id" uuid NULL,
            "image_input_id" uuid NULL,
            "generated_image_url" text NOT NULL,
            "headline" varchar(120) NOT NULL,
            "body_text" varchar(400) NOT NULL,
            "cta_text" varchar(200) NOT NULL,
            "time_slot" varchar(10) NOT NULL,
            "status" varchar(20) NOT NULL DEFAULT 'draft',
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT fk_stories_batch FOREIGN KEY ("batch_id") REFERENCES "story_batches"("id") ON DELETE CASCADE,
            CONSTRAINT fk_stories_workspace FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE,
            CONSTRAINT fk_stories_product FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL,
            CONSTRAINT fk_stories_image_input FOREIGN KEY ("image_input_id") REFERENCES "product_images"("id") ON DELETE SET NULL
        )`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_stories_workspace ON "stories"("workspace_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_stories_batch ON "stories"("batch_id")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_stories_product ON "stories"("product_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "stories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "story_batches"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "workspace_settings"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_images"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "instagram_accounts"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "workspaces"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}
