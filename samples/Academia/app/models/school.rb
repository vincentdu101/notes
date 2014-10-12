class School < ActiveRecord::Base

  has_many :school_classes
  has_many :users

end
