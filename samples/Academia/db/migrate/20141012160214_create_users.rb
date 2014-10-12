class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :middle_name
      t.string :email
      t.string :username
      t.string :password
      t.string :confirm_password
      t.datetime :last_login_date
      t.string :role
      t.integer :default_school_id
      t.boolean :archived


      t.timestamps
    end
  end
end
