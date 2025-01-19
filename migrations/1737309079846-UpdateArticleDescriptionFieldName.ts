import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticleDescriptionFieldName1737309079846 implements MigrationInterface {
    name = 'UpdateArticleDescriptionFieldName1737309079846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "descriptions" TO "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" RENAME COLUMN "description" TO "descriptions"`);
    }

}
