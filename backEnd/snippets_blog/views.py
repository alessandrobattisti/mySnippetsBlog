from django.shortcuts import render, HttpResponse
from .models import *
# Create your views here.

################################################################################
#################################### API #######################################
################################################################################

def not_cat_tags():
    not_cat_tags=list()
    for t in Tag.objects.all():
        if t.category_set.all().count()<1:
            not_cat_tags.append(t)
    return not_cat_tags

from django.http import JsonResponse
from collections import OrderedDict
def categories(request):
    categories=Category.objects.all().order_by('category')
    response=OrderedDict()
    for cat in categories:
        response[cat.category]=list()
        for tag in cat.tags.all().order_by('tag'):
            response[cat.category].append({'tag':tag.tag,'post_count':tag.post_number})

    not_cat=not_cat_tags()
    if not_cat:
        response["Not categorized tags"]=list()
        for tag in not_cat:
            response["Not categorized tags"].append({'tag':tag.tag,'post_count':tag.post_number})

    return JsonResponse(response)

some_data_to_dump = {
   'some_var_1': 'foo',
   'some_var_2': 'bar',
}
import json
def logged(request):
    if request.user.is_staff:
        return HttpResponse(json.dumps({'logged':True}), content_type='application/json')
    else:
        return HttpResponse(json.dumps({'logged':False}), content_type='application/json')


from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models.expressions import F
from .serializers import *
from rest_framework import generics,pagination,filters
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
import django_filters

class PostListFilter(django_filters.FilterSet):
    tags = django_filters.CharFilter(
        field_name='tags__tag',
    )
    #tags = django_filters.CharFilter()

    class Meta:
        model = Post
        fields = ['tags','slug']

class EndlessPagination(pagination.PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 4

class CommentList(generics.ListAPIView):
    queryset = Comment.objects.all().order_by('created')
    serializer_class = CommentSerializer
    permission_classes = (AllowAny,)
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_fields = ('post__slug',)
    page_size = 1000

class CommentCreate(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentDestroy(generics.DestroyAPIView):
    authentication_classes = (TokenAuthentication, )
    queryset = Comment.objects.all()
    serializer_class = EditPostSerializer
    lookup_field=('id')

class TagUpdate(generics.RetrieveUpdateAPIView):
    authentication_classes = (TokenAuthentication, )
    queryset = Tag.objects.all()
    serializer_class = EditTagSerializer
    lookup_field=('tag')

class PostList(generics.ListAPIView):
    queryset = Post.objects.filter(published=True).order_by('-created')
    serializer_class = ListPostSerializer
    pagination_class = EndlessPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
    filter_class = PostListFilter
    filter_fields = ('tags','slug')
    #permission_classes = (IsAdminUser,)
from itertools import chain
class PostListSearch(generics.ListAPIView):
    serializer_class = ListPostSerializer
    pagination_class = EndlessPagination

    def get_queryset(self):
        query = self.request.query_params.get('query', None)
        matches = Post.objects\
            .annotate(rank=SearchRank(F('search'), SearchQuery(query)))\
            .filter(rank__gte=0.001)
        tags = Post.objects.filter(tags__tag__icontains=query)
        all_results = list(chain(matches, tags))
        return list(set(all_results))

class PostCreate(generics.CreateAPIView):
    authentication_classes = (TokenAuthentication, )
    queryset = Post.objects.filter(published=True).order_by('-created')
    serializer_class = EditPostSerializer

class PostUpdate(generics.RetrieveUpdateAPIView):
    authentication_classes = (TokenAuthentication, )
    queryset = Post.objects.filter(published=True).order_by('-created')
    serializer_class = EditPostSerializer
    lookup_field=('slug')

class PostDestroy(generics.DestroyAPIView):
    authentication_classes = (TokenAuthentication, )
    queryset = Post.objects.all()
    serializer_class = EditPostSerializer
    lookup_field=('slug')


from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        token.delete()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })
