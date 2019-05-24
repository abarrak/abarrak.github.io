---
title: Using UUIDs as Primary Key for Active Record Models
tags: [Active Record, UUID Primary Key, Postgres, Ruby, Rails]
---

<img src="{{ site.baseurl }}/public/images/uuids-db.png" class="post-image center-image" />

It's advised that using universally unique identifiers (UUIDs) for exposed resource identifiers is [more secure](https://github.com/eliotsykes/rails-security-checklist#ids), and [convenient for database distribution](https://tomharrisonjr.com/uuid-or-guid-as-primary-keys-be-careful-7b2aa3dcb439).

As expected, it's relatively simple to configure Active Record to generate with `UUID` primary key based migrations.

## Setup 

Here are the steps:

1. Setup the default generation inside `config/application.rb`:

   ```ruby
   # config/application.rb
   
   module SampleApp
     class Application < Rails::Application
       ...
       # Change the primary key default type to UUIDs.
       config.generators do |g|
         g.orm :active_record, primary_key_type: :uuid
       end
      end
   end
   ```

2. Enable the database support:

  - PostgresSQL:

     Enable  `uuid-ossp` extension for random `:uuid` generation at the DB level.
     ```ruby
     # db/migrations/xxxxx_enable_uuid_ossp_extension.rb.rb
     
     class EnableUuidOsspExtension < ActiveRecord::Migration[5.2]
       def change
         enable_extension 'uuid-ossp' unless extension_enabled?("uuid-ossp")
       end
     end
     ```
      For new Postgres versions ( >= 9.4), `pgcrypto` extension can be used alternatively.

<!-- post-excerpt -->
  
  - SQLite:

    As `UUID` is not naively available in SQLite.
  
    A workaround is to utilize generic `varchar` or `blob(16)` columns instead. [Some people have reported](https://stackoverflow.com/a/52032839) they needed to load the adapter file in order for it to work.
  
  - SQL Server:
  
     Has `:uuid` native support (through `uniqueidentifier` column type) with the generator.

<br>
Now newly generated tables they will contain `:uuid` as primary key.

```ruby
# db/migrations/xxxxx_create_customers.rb
class CreateCustomers < ActiveRecord::Migration[5.2]
 def change
   create_table :customers, id: :uuid do |t|
     t.string :full_name, null: false, index: true
     t.string :email, index: true

     t.uuid :ceeated_by, null: false
     t.uuid :updated_by, null: true

     t.timestamps
   end
   add_foreign_key :customers, :users, column: :ceeated_by
   add_foreign_key :customers, :users, column: :updated_by
 end
end
 ```

Also, the snippet above shows `:uuid` type usage for other non-primary key columns too.

In case you don't require `UUID` key type, it's possible to get the `integer` or `bigint` types back again:

```ruby
create_table :cities, id: :integer do |t|
 t.string :name
 t.float :population
end
```

## Ordering Results

A drawback of querying UUID-based tables is that ordering is not simply inferred as with the sequential keys. 
We have to set it up using default ordering scope, easily:

   ```ruby
   # app/models/customer.rb
   class Customer < ApplicationRecord
     ...
     default_scope -> { order(created_at: :asc) }
   end
   ```

   Ensure that indices on `created_at` columns already added for boosted performance.

   ```ruby
   # db/migrations/xxxxx_add_created_at_indices.rb
   class AddCreatedAtIndices < ActiveRecord::Migration[5.2]
     def change
       add_index :customers, :created_at
       add_index :surveys, :created_at
       add_index :additional_informations, :created_at
     end
   end
   ```

Keep in mind the additional storage cost of `:uuid` keys compared to sequential ones, which requires balancing the trade-offs when designing your data models.
