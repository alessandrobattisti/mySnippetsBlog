const tag_list_url = 'http://localhost/api/tag_list/'
const delete_post_url = 'http://localhost/api/posts/destroy/'
const list_post_url = 'http://localhost/api/posts/list?format=json&page=1'
const list_post_url_by_tag = 'http://localhost/api/posts/list?format=json&page=1&tags='
const post_update_url = 'http://localhost/api/posts/update/'
const post_create_url = 'http://localhost/api/posts/create'
const list_categories_url = 'http://localhost/api/categories'
const comment_list_url = 'http://localhost/api/comment_list?post__slug='
const create_comment_url = 'http://localhost/api/comment/create/'
const delete_comment_url = 'http://localhost/api/comment/destroy/'
const api_token_auth = 'http://localhost/api/api-token-auth/'
const search_post_url = 'http://localhost/api/post/search?query='

export {api_token_auth, tag_list_url, delete_post_url, list_post_url,
  list_post_url_by_tag, post_update_url, post_create_url, list_categories_url,
  comment_list_url, delete_comment_url, create_comment_url, search_post_url}
