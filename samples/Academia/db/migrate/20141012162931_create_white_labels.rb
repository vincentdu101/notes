class CreateWhiteLabels < ActiveRecord::Migration
  def change
    create_table :white_labels do |t|
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
