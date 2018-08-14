from django.conf.urls import url
from . import views
#from rest_framework.authtoken import views as views_token

urlpatterns = [

    url(r'^api-token-auth/', views.CustomAuthToken.as_view(), name="auth-token"),
    url(r'^post/search$', views.PostListSearch.as_view(), name="post_search"),

    url(r'^comment/create/$', views.CommentCreate.as_view(), name="postcreate"),
    url(r'^comment_list$', views.CommentList.as_view(), name="comment_list"),
    url(r'^comment/destroy/(?P<id>.+)$', views.CommentDestroy.as_view(), name="commentdestroy"),
    url(r'^tag_list/(?P<tag>.+)$', views.TagUpdate.as_view(), name="tag_list"),
    url(r'^logged$', views.logged, name="logged"),
    url(r'^posts/list$', views.PostList.as_view(), name="tsitiapi"),
    url(r'^posts/create$', views.PostCreate.as_view(), name="postcreate"),
    url(r'^posts/update/(?P<slug>.+)$', views.PostUpdate.as_view(), name="postupdate"),
    url(r'^posts/destroy/(?P<slug>.+)$', views.PostDestroy.as_view(), name="postdestroy"),
    url(r'^categories$', views.categories, name="categories"),

]
