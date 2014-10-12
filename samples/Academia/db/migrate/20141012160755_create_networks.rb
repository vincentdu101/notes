class CreateNetworks < ActiveRecord::Migration
  def change
    create_table :networks do |t|
      t.string :name
      t.boolean :archived

      t.timestamps
    end
  end
end
