##
# A simple jekyll pluging to distinguish date for :ar and :en languages
# inside the post page.
#
# Usage:
#   {% render_date %}
#
# Author: Abdullah Barrak (abarrak)
# License: Unlicensed.
##
require 'date'

module Jekyll
  class RenderDateTag < Liquid::Tag

    AR_MONTHS = {
      Jan: 'يناير',
      Feb: 'فبراير',
      Mar: 'مارس',
      Apr: 'أبريل',
      May: 'مايو',
      Jun: 'يونيو',
      Jul: 'يوليو',
      Aug: 'أغسطس',
      Sep: 'سبتمبر',
      Oct: 'أكتوبر',
      Nov: 'نوفمبر',
      Dec: 'ديسمبر',
    }

    def initialize tag_name, text, tokens
      super
    end

    def render context
      date = context['page']['date'].strftime("%d %b %Y").to_s
      if context['page']['language'] == 'ar'
        m = date.split(' ')[1]
        date.sub! m, AR_MONTHS[m.to_sym]
      end
      date
    end
  end
end

Liquid::Template.register_tag('render_date', Jekyll::RenderDateTag)
