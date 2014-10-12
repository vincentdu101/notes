class CreateSchoolNetworks < ActiveRecord::Migration
  def change
    create_table :school_networks do |t|
      t.integer :school_id
      t.integer :network_id
      t.boolean :archived
      t.timestamps
    end
  end
end
