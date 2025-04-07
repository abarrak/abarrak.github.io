---
title: Testing Active Record Integration in Ruby Gems
tags: [rails, activerecord, unit testing, testing, rspec]
categories: [Ruby, Rails, Active Record, Unit Testing]
---


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When I was writing [the expiry calculator](https://github.com/abarrak/expiry_calculator) gem (extracted from license management system), the library's main logic has some sort of integration with **ActiveRecord**, and I needed to verify that the easy way.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mocking the built-in active record connection pool and tables mapping showed to be cumbersome and may not not ideally allow me to validate the intended behaviour. Luckily, I found pieces in SO and Github to do the unit testing in few simple steps, with a on the fly db (Sqlite). I have put it together in the following guide polished for **Rspec** and with ad-hoc migration methods.

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
   Replace `post_table` with your intended model with the attributes (columns) you need.

```ruby
# spec/support/db_helper.rb
module TestDbHelper
  def establish_coonection
    ActiveRecord::Base.establish_connection adapter: "sqlite3", database: ":memory:"
  end

  def up
    ActiveRecord::Base.connection.create_table :post_table do |t|
      t.integer :name
      t.date :post_date
      t.timestamps
    end
  end

  def down
    ActiveRecord::Base.connection.drop_table :post_table
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

**4.** Then, invoke the db functions.<br>
   Also build an active record model anonymously in `let` statements.

```ruby
RSpec.describe MyGemClass do
  # ...
  context "Arguments" do

    establish_coonection

    before { up }
    after { down }

    let(:post_class) do
      Class.new(ActiveRecord::Base) { self.table_name = "post_table" }
    end

    let(:post) { post_class.new(post_date: Date.today + 10) }

  end
end
```

**5.** At last, here's an edited test case of the model against by the gem's original test `(calculate)`.

```ruby
it "supports active_record parameter with attr accessor" do
  expect(subject.calculate(post, :post_date)).to eq(10)
end
```

Done.

<img src="{{ site.baseurl_root }}/public/images/respec-test-ar-models-in-gems.png" class="post-image resize-lg center-image">
