class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.string :name
      t.string :address
      t.string :city
      t.string :state
      t.string :zipcode
      t.string :phone
      t.string :website
      t.string :email
      t.integer :network_school_id
      t.boolean :archived

      t.timestamps
    end
  end
end
