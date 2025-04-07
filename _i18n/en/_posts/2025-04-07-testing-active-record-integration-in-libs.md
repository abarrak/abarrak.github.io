---
title: Testing Active Record Integration in Ruby Gems
tags: [rails, activerecord, unit testing, testing, rspec]
categories: [Ruby, Rails, Active Record, Unit Testing]
---


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When I was writing [the expiry calculator](https://github.com/abarrak/expiry_calculator) gem (extracted from a license management system), the library's main logic has some sort of integration with **ActiveRecord**, and I needed to verify that the easy way.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mocking the built-in active record connection pool and tables mapping showed to be cumbersome and may not ideally allow to validate the intended behaviour. Luckily, I found pieces in SO and Github to do the unit testing in few simple steps, with on the fly db (Sqlite). I have put it together in the following guide, polished for **Rspec** with ad-hoc migration methods.

<!-- post-excerpt -->

## Steps

**1)** Adding the required libraries in the dev group of our Gem spec file.

```ruby
Gem::Specification.new do |spec|
  # ..
  spec.add_development_dependency "activerecord", "~> 7"
  spec.add_development_dependency "sqlite3", "~> 2"
end
```

**2.** The db setup logic is extracted in a helper.<br>
   Replace `posts` with your intended model with the attributes (columns) you need.

```ruby
# spec/support/db_helper.rb
module TestDbHelper
  def establish_coonection
    ActiveRecord::Base.establish_connection adapter: "sqlite3", database: ":memory:"
  end

  def up
    ActiveRecord::Base.connection.create_table :posts do |t|
      t.integer :name
      t.date :ends_at
      t.timestamps
    end
  end

  def down
    ActiveRecord::Base.connection.drop_table :posts
  end
end
```

**3.** For convenience, I mixed in the helper in the example and example group classes of **rspec**.

```ruby
require "support/db_helper"

RSpec.configure do |config|
  # ...
  config.include TestDbHelper
  config.extend TestDbHelper
end
```

**4.** Then, we invoke the db functions.<br>
   Also we build an anonymous model in `let` statements.

```ruby
RSpec.describe MyGemClass do
  # ...
  context "Arguments" do

    establish_coonection

    before { up }
    after { down }

    let(:model_class) do
      Class.new(ActiveRecord::Base) { self.table_name = "posts" }
    end

    let(:model) { model_class.new(ends_at: Date.today + 10) }

  end
end
```

**5.** Lastly, we use the model to test against in our case (`calculate` here).

```ruby
it "supports active_record parameter with attr accessor" do
  expect(subject.calculate(model, :ends_at)).to eq(10)
end
```

Done.

<img src="{{ site.baseurl_root }}/public/images/respec-test-ar-models-in-gems.png" class="post-image resize-lg center-image">
