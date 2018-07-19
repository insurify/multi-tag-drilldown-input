(function($) {
  var pluginName = 'multiTagDrilldownInput';

  function MultiSelectTypeaheadInput(element, options) {
    this._input = element;
    this.$input = $(element);
    this.options = options;

    this.currentTag = 0;
    this.defaultCssClasses = {
      input: 'typeahead',
      hint: 'typeahead'
    };
    if (options.alwaysVisible) {
      this.defaultCssClasses.menu = 'tt-menu always-visible';
    }

    // Tag specific options
    this.defaultTagOptions = {
      tokenizer_key: 'tt_text',
      min_length: 0,
      max_limit: 100,
      display_limit: 100,
      value_key: 'tt_value',
      display_key: 'tt_text',
      suggestion_render_type: 'list',
      custom_classes: {},
      input_heading: 'Select',
      load_more_btn: false,
      load_more_btn_clicked: false,
      log: false
    };
    this.init();
  }

  // General settings
  MultiSelectTypeaheadInput.prototype.defaults = {
    value_key: 'tt_value',
    display_key: 'tt_text',
    alwaysVisible: false,
    disableMobileKeyboard: false
  };

  MultiSelectTypeaheadInput.prototype.init = function() {
    this.config = $.extend(this.defaults, this.options);
    var defaults = this.defaultTagOptions;
    var newopts = $.map(this.config.tagsOptions, function(tag) {
      return $.extend({}, defaults, tag);
    });
    this.config.tagsOptions = newopts;
    this.$input.tagsinput({
      itemValue: this.config.value_key,
      itemText: this.config.display_key,
      maxTags: this.maxTags,
      freeInput: false,
      allowDuplicates: false
    });

    this.$input
      .tagsinput('input')
      .on(
        'typeahead:selected',
        function(obj, datum) {
          // this.trigger('car_input_typeahead:selected', datum, this.searchTerm);
          var currentOptions = this.getCurrentOptions();
          if (!datum.tt_text) datum.tt_text = datum[currentOptions.display_key];
          if (!datum.tt_value) datum.tt_value = datum[currentOptions.value_key];
          this.$input.tagsinput('add', datum);
        }.bind(this)
      )
      .on(
        'keydown',
        function(e) {
          if (e.keyCode === 32) {
            // for space
            // this.trySpaceAutoComplete();
          } else if (e.keyCode === 37) {
            // disabling left navigation key
            return false;
          }
        }.bind(this)
      )
      .on(
        'typeahead:render',
        function() {
          $('.tt-suggestion.tt-selectable')
            .first()
            .addClass('tt-cursor');
          $('#car_input_load_more').on(
            'click',
            function(e) {
              var currentOptions = this.getCurrentOptions();
              currentOptions.load_more_btn = false;
              currentOptions.display_limit = currentOptions.max_limit;
              this.initializeInput();
            }.bind(this)
          );
          this.$input.trigger('car_input_typeahead:rendered');
          //setTimeout(this.updateContainerHeight.bind(this), 1);
        }.bind(this)
      );

    this.$input
      .on('itemAdded', this.onTagAdded.bind(this))
      .on('itemRemoved', this.onTagRemoved.bind(this));

    this.allocateDataSource();
    return this;
  };

  MultiSelectTypeaheadInput.prototype.onTagAdded = function(ev) {
    if (this.config.onTagAdded) {
      this.config.onTagAdded(this.getCurrentOptions(), ev.item);
    }

    if (typeof ev.item.__backindex === 'undefined') {
      ev.item.__backindex = this.currentTag;
    }

    this.currentTag += 1;

    if (this.currentTag < this.config.tagsOptions.length) {
      this.initializeInput();
    } else {
      this.finalize();
    }
  };

  MultiSelectTypeaheadInput.prototype.finalize = function() {
    this.$input.tagsinput('input').typeahead('destroy');
    this.updateInputHelpText('');
    $('.twitter-typeahead .typeahead').attr('readonly', true);
    this.config.complete.apply(null, this.getCurrentTagItems());
  };

  MultiSelectTypeaheadInput.prototype.onTagRemoved = function(ev) {
    this.currentTag = ev.item.__backindex;
    var currentTags = this.getCurrentTagItems();

    this.$input.off('itemRemoved');
    for (var i = currentTags.length - 1; i >= this.currentTag; i--) {
      this.$input.tagsinput('remove', currentTags[i]);
    }
    this.$input.on('itemRemoved', this.onTagRemoved.bind(this));
    this.initializeInput();
  };

  MultiSelectTypeaheadInput.prototype.initializeInput = function() {
    this.$input.tagsinput('input').typeahead('destroy');
    this.allocateDataSource();
  };

  MultiSelectTypeaheadInput.prototype.updateInputHelpText = function(
    placeholder
  ) {
    this.$input.tagsinput('input').attr('placeholder', placeholder);
  };
  /* Allocate data set to tagsinput box, also assign values to typeahead
  * @param options
  */
  MultiSelectTypeaheadInput.prototype.allocateDataSource = function() {
    //var existingItems = this.$input.val();

    var currentOptions = this.getCurrentOptions();
    var data;

    this.updateInputHelpText(currentOptions.placeholder);

    if (typeof currentOptions.data_source == 'function') {
      data = currentOptions.data_source.apply(null, this.getCurrentTagItems());
    } else {
      data = currentOptions.data_source;
    }

    var dataSet;
    if (typeof data == 'string') {
      var bloodhoundConfig = {
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace(
          currentOptions.tokenizer_key
        ),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        identify: function(obj) {
          return obj[currentOptions.tokenizer_key];
        }
      };
      if (typeof currentOptions.wildcard_param == 'undefined') {
        bloodhoundConfig.prefetch = {
          url: data,
          transform: currentOptions.data_transform
        };
      } else {
        bloodhoundConfig.remote = {
          url: data,
          wildcard: currentOptions.wildcard_param,
          transform: currentOptions.data_transform
        };
      }

      var predataSet = new Bloodhound(bloodhoundConfig);

      if (typeof currentOptions.wildcard_param == 'undefined') {
        dataSet = function(q, sync) {
          if (q === '') {
            sync(predataSet.all()); // This is the only change needed to get 'ALL' items as the defaults
          } else {
            predataSet.search(q, sync);
          }
        };
      } else {
        dataSet = predataSet;
      }
    } else {
      if (data.length == 1) {
        data[0].__backindex = this.currentTag - 1;
        this.$input.tagsinput('add', data[0]);
        return;
      }

      dataSet = function(q, sync) {
        var matches = [];
        var substrRegex = new RegExp(q, 'i');
        $.each(data, function(i, obj) {
          if (substrRegex.test(obj[currentOptions.tokenizer_key])) {
            matches.push(obj);
          }
        });
        sync(matches);
      };
    }

    this.$input.tagsinput('input').typeahead(
      {
        hint: true,
        minLength: currentOptions.min_length,
        highlight: true,
        classNames: $.extend(
          {},
          this.defaultCssClasses,
          currentOptions.custom_classes
        )
      },
      {
        limit: currentOptions.display_limit,
        name: currentOptions.data_holder_name,
        displayKey: function(item) {
          return item[currentOptions.display_key];
        },
        templates: this.getTemplates(currentOptions),
        source: dataSet
      }
    );
    this.setFocusTriggers();
    if (isMobile() && this.config.disableMobileKeyboard) {
      $('.twitter-typeahead .typeahead').attr('readonly', true);
    }
    if (this.config.autoFocus) {
      this.$input.tagsinput('focus');
    }
  };

  MultiSelectTypeaheadInput.prototype.getTemplates = function(currentOptions) {
    var templates = {
      empty: function() {
        if (currentOptions.ShowMoreBtnClicked) {
          if (!this.getItemForEmptyResult(this.tagState) && !this.isFound) {
            return '<div class="empty-message">No match found</div>';
          }
        } else {
          return '<div class="empty-message">No match found</div>';
        }
        return '';
      }.bind(this),
      header: function() {
        var headerLabel = this.$input.closest('div').find('.tag-label');
        if (headerLabel.length > 0) {
          headerLabel.html('<span>' + currentOptions.input_heading + '</span>');
        } else {
          this.$input
            .closest('div')
            .find('.tt-menu')
            .prepend(
              '<div class="tag-label"><span>' +
                currentOptions.input_heading +
                '</span></div>'
            );
        }
      }.bind(this),
      footer: function() {
        if (currentOptions.load_more_btn) {
          return '<a class="btn-load" id="car_input_load_more" href="javascript:void(0)">Load more</a>';
        }
        return '';
      }.bind(this)
    };

    return $.extend(currentOptions.templates, templates);
  };

  // -----------------------------------------

  /**
   * When input is focus then container need to be in active state
   //  */
  MultiSelectTypeaheadInput.prototype.setFocusTriggers = function() {
    var tag_input = $('.twitter-typeahead .typeahead');
    tag_input
      .on(
        'focus',
        function(e) {
          $(e.currentTarget)
            .closest('.bootstrap-tagsinput')
            .addClass('active');
          this.$input.trigger('car_input_typeahead:focused');
        }.bind(this)
      )
      .on('blur', function(e) {
        $(this)
          .closest('.bootstrap-tagsinput')
          .removeClass('active');
      });
  };

  MultiSelectTypeaheadInput.prototype.getCurrentOptions = function() {
    return this.config.tagsOptions[this.currentTag];
  };

  MultiSelectTypeaheadInput.prototype.getCurrentTagItems = function() {
    return this.$input.tagsinput('items');
  };

  function isMobile() {
    return !!/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent
    );
  }

  $.fn.multiTagDrilldownInput = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin')) {
        $.data(this, 'plugin', new MultiSelectTypeaheadInput(this, options));
      }
    });
  };
  $.fn.multiTagDrilldownInput.defaults = {};
})(jQuery);
