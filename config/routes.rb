Rails.application.routes.draw do
  resources :pomodoros, only: [:index, :create]
end
