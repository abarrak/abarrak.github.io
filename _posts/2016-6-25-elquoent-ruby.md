---
title: Eloquent Ruby (Book Review)
tags: Ruby, Book Review, Programming, Reading, Software Development
---

<img src="{{ site.baseurl }}/public/images/eloquent-ruby-cover.jpg" class="post-image resize-30" alt="book-cover" />

Recently, I've read Oslen Russ's <a href="https://amzn.com/0321584104" target="_blank">"Eloquent Ruby"</a> and it was delightful read overall.

The book has a considerable reputation among the community programmers. It's divided into (4) units on Ruby foundations and software process practices.

**Part (1)** and **(2)** form the first half of the book. They start with the language basics, types and features, in addition to the coverage of OOP methodologies in Ruby (classes, modules, blocks).

In **Part (3)**, we see the metaprogramming capabilities and techniques. First chapter introduces the concept and some hook methods like `included`, `inherited`, and `at_exit` which keep the application life cycle more interactive and informed. Three consecutive chapters talk about the valuable dynamic programming function `method_missing` and its use cases for **better error handling**, **delegation**, and **building flexible APIs**. Last chapters discuss monkey patching and self modifying code. For me this was the most interesting part of the book.
<!-- post-excerpt -->

Putting all covered topics in actions is what **Part (4)** concerns about. The subjects in this part are internal and external DSLs constructions, and publishing Gems (packages), along with a brief tour on some of Ruby's popular Implementations.

I liked the writing style the author followed, which was example driven and kind of story telling. Each chapter starts with a motivational situation or by raising question, then it goes for building up the solution and revisiting it for improvements in an iterative way (dominant example is [the document class](https://rubygems.org/gems/document/)). Each chapter also has bits of real ruby code from libraries or actual projects in a subsection tilted *"In the Wild"*.

### **Conclusion**
 Albeit there is a small portion of the book that's outdated, I would argue that the majority of its content is still relevant now and times to come.

 If you're looking for eloquently written material that explores and explains important aspects and background of the Ruby programming language without going into lengthy documentation details, then go with Eloquent Ruby !
