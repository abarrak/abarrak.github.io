##
# A simple jekyll filter for :ar language dates.
#
# Usage:
#   {% post.date | arabic_date %}
#
# Author: Abdullah Barrak (abarrak)
# License: Unlicensed.
##
require 'date'

module Jekyll
  module ArabicDate

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

    def arabic_date input
      date = input.to_datetime.strftime("%d %b %Y")
      m = date.split(' ')[1]
      date.sub m, AR_MONTHS[m.to_sym]
    end
  end
end

Liquid::Template.register_filter(Jekyll::ArabicDate)
