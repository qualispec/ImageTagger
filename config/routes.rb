ImageTagger::Application.routes.draw do

root to: "tags#index"

resources :tags

end