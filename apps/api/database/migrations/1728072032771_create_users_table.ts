import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.string('username', 254).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').nullable()
      table.string('avatar').nullable()
      table.enu('status', ['active', 'inactive', 'pending']).notNullable().defaultTo('pending')

      table.string('provider_id').nullable()
      table.string('provider_name').nullable()

      table.timestamp('last_login_at').nullable()
      table.integer('score').notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
