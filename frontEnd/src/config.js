const host = 'http://localhost/'
const tag_list_url = host + 'api/tag_list/'
const delete_post_url = host + 'api/posts/destroy/'
const list_post_url = host + 'api/posts/list?format=json&page=1'
const list_post_url_by_tag = host + 'api/posts/list?format=json&page=1&tags='
const post_update_url = host + 'api/posts/update/'
const post_create_url = host + 'api/posts/create'
const list_categories_url = host + 'api/categories'
const comment_list_url = host + 'api/comment_list?post__slug='
const create_comment_url = host + 'api/comment/create/'
const delete_comment_url = host + 'api/comment/destroy/'
const api_token_auth = host + 'api/api-token-auth/'
const search_post_url = host + 'api/post/search?query='

export {api_token_auth, tag_list_url, delete_post_url, list_post_url,
  list_post_url_by_tag, post_update_url, post_create_url, list_categories_url,
  comment_list_url, delete_comment_url, create_comment_url, search_post_url}
