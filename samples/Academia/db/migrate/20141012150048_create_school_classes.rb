class CreateSchoolClasses < ActiveRecord::Migration
  def change
    create_table :school_classes do |t|
      t.string :name
      t.string :subject
      t.integer :size
      t.datetime :start_date
      t.datetime :end_date
      t.boolean :archived

      t.timestamps
    end
  end
end
