class PomodorosController < ApplicationController
  def index

  end

  def create
    client = Slack::Web::Client.new
    client.chat_postMessage(
      channel: 'C02BN506KNY',
      text: '<@U025JDDVD3L> 終わったよー。お疲れ様！'
    )
    puts "Done"
  end
end
