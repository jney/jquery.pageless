desc "generate fake articles"
task :generate_fake_articles => :environment do
  require "populator"
  Article.populate(100) do |article|
    article.title   = Populator.words(3..8).titleize
    article.body    = Populator.sentences(2..10)
    article.author  = Populator.words(2).titleize
  end
end