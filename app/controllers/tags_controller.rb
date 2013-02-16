class TagsController < ApplicationController

  def index
    respond_to do |format|
      format.html { render :index }
      format.json { render :json => Tag.all }
    end
  end

  def create
    @tag = Tag.create!(params[:tag])

    respond_to do |format|
      format.json { render :json => @tag }
    end
  end

end