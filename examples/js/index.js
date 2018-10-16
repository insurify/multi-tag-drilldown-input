var baseUrl = 'http://localhost:8000/api';
var inputParams = {
  alwaysVisible: true,
  disableMobileKeyboard: true,
  complete: function(language, repository, contributor) {
    console.log(language, repository, contributor);
    $('.goto')
      .attr('href', contributor.html_url)
      .text(contributor.login);
    $('.result').show();
    console.log('complete', contributor);
    return this;
  },
  onTagAdded: function(tagConfig, selectedTag) {
    console.log('onTagAdded', tagConfig, selectedTag);
  },
  tagsOptions: [
    {
      data_holder_name: 'language',
      min_length: 0,
      placeholder: 'Language',
      input_heading: 'Select programming language',
      data_source: [
        { tt_text: 'javascript', tt_value: 'javascript' },
        { tt_text: 'python', tt_value: 'python' },
        { tt_text: 'php', tt_value: 'php' },
        { tt_text: 'ruby', tt_value: 'ruby' }
      ]
    },
    {
      max_limit: 100,
      display_limit: 500,
      tokenizer_key: 'name',
      value_key: 'full_name',
      display_key: 'full_name',
      data_source: function(language) {
        console.log('data source', language);
        return (
          'https://api.github.com/search/repositories?q=language:' +
          language.tt_value +
          '+stars:>=5000'
        );
      },
      data_transform: function(response) {
        return response.items;
      },
      data_container: '',
      data_holder_name: 'repository',
      tt_data: 'repository',
      min_length: 0,
      placeholder: 'Repository',
      sort_response_by: '',
      //if need to render cards instead of text input

      input_heading: 'Select repository'
    },
    {
      tokenizer_key: 'login',
      value_key: 'login',
      display_key: 'login',
      data_container: 'contributor',
      max_limit: 100,
      display_limit: 100,
      data_holder_name: 'contibutor',
      min_length: 0,
      placeholder: 'Contributor',
      suggestion_render_type: 'list',
      input_heading: 'Select a contributor',
      custom_classes: {
        // to be added along with typeahead classes
        suggestion: 'tt-suggestion cards-list card-mini'
      },
      templates: {
        suggestion: createCardSuggestion
      },
      data_source: function(language, repo) {
        return repo.contributors_url;
      }
    }
  ]
};

function createCardSuggestion(item) {
  return (
    '<div class="tt-suggestion tt-selectable car-sprite cards-list card-mini">' +
    '<div class="card">' +
    '<a href="javascript:void(0)" data-id="56">' +
    '<img src="' +
    item.avatar_url +
    '" />' +
    '<span>' +
    item.login +
    '</span>' +
    '</a>' +
    '</div>' +
    '</div>'
  );
}

$('#repos_tag_input').multiTagDrilldownInput(inputParams);

$(document).on('typeahead:selected', function(ev, what) {
  console.log('selected', what);
});

{
  /* <div class="tt-suggestion tt-selectable">1996</div>; */
}
