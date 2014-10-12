class CreateUserNetworks < ActiveRecord::Migration
  def change
    create_table :user_networks do |t|
      t.integer :user_id
      t.integer :network_id
      t.boolean :archived
      t.timestamps
    end
  end
end
