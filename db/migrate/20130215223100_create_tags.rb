class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name
      t.integer :x
      t.integer :y
      t.integer :photo_id

      t.timestamps
    end
  end
end
